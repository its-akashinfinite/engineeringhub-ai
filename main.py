import os
import json
import re
from datetime import date
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

# Enable CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HISTORY_FILE = "stats_history.json"
USERNAME_PATTERN = re.compile(r"^[a-zA-Z0-9_\\-]+$")

# Helper to manage local history DB
def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_history(data):
    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f, indent=4)

# --- EXISTING AUDIO PROCESSING PLACEHOLDERS ---
@app.post("/api/denoise")
async def denoise_audio(file: UploadFile = File(...)):
    return {
        "original_waveform": [0.1, 0.2, -0.1, 0.4], 
        "processed_waveform": [0.05, 0.1, -0.02, 0.3], 
        "processed_audio_base64": ""
    }

# --- LEETCODE TRACKER & HISTORY PROXY ---
@app.get("/api/leetcode/{username}")
async def get_leetcode_stats(username: str):
    if not USERNAME_PATTERN.match(username):
        raise HTTPException(status_code=400, detail="Invalid username format")
        
    url = "https://leetcode.com/graphql"
    query = """
    query userProblemsSolved($username: String!) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
            submitStats {
                acSubmissionNum { difficulty count }
            }
            profile { ranking }
        }
    }
    """
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json={"query": query, "variables": {"username": username}}, timeout=10.0)
            if response.status_code != 200:
                raise HTTPException(status_code=502, detail="Failed to fetch from LeetCode")
            
            res_data = response.json()
            if "errors" in res_data or not res_data.get("data", {}).get("matchedUser"):
                raise HTTPException(status_code=404, detail="User not found on LeetCode")
                
            data = res_data["data"]
            total_counts = {item["difficulty"]: item["count"] for item in data["allQuestionsCount"]}
            solved_counts = {item["difficulty"]: item["count"] for item in data["matchedUser"]["submitStats"]["acSubmissionNum"]}
            ranking = data["matchedUser"]["profile"]["ranking"]
            
            payload = {
                "username": username,
                "total_solved": solved_counts.get("All", 0),
                "global_ranking": ranking,
                "acceptance_rate": 45.2,
                "breakdown": {
                    "easy_solved": solved_counts.get("Easy", 0),
                    "easy_total": total_counts.get("Easy", 0),
                    "medium_solved": solved_counts.get("Medium", 0),
                    "medium_total": total_counts.get("Medium", 0),
                    "hard_solved": solved_counts.get("Hard", 0),
                    "hard_total": total_counts.get("Hard", 0)
                }
            }
            
            # Save history checkpoint
            history = load_history()
            today_str = str(date.today())
            if username not in history:
                history[username] = {}
            
            history[username][today_str] = {
                "date": today_str,
                "total_solved": payload["total_solved"],
                "easy": payload["breakdown"]["easy_solved"],
                "medium": payload["breakdown"]["medium_solved"],
                "hard": payload["breakdown"]["hard_solved"]
            }
            save_history(history)
            
            return payload
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="LeetCode API timed out or unavailable")

@app.get("/api/leetcode/{username}/history")
async def get_leetcode_history(username: str):
    history = load_history()
    user_data = history.get(username, {})
    sorted_history = sorted(user_data.values(), key=lambda x: x["date"])
    return sorted_history

# --- GITHUB PROXY ENDPOINT ---
@app.get("/api/github/{username}")
async def get_github_profile(username: str):
    if not USERNAME_PATTERN.match(username):
        raise HTTPException(status_code=400, detail="Invalid username format")
        
    headers = {"User-Agent": "FastAPI-Portfolio-Proxy"}
    
    try:
        async with httpx.AsyncClient() as client:
            profile_resp = await client.get(f"https://api.github.com/users/{username}", headers=headers, timeout=10.0)
            if profile_resp.status_code == 404:
                raise HTTPException(status_code=404, detail="GitHub user not found")
                
            repos_resp = await client.get(f"https://api.github.com/users/{username}/repos?sort=updated&per_page=6", headers=headers, timeout=10.0)
            
            p_data = profile_resp.json()
            r_data = repos_resp.json() if repos_resp.status_code == 200 else []
            
            repositories = []
            for repo in r_data:
                repositories.append({
                    "name": repo.get("name"),
                    "description": repo.get("description") or "No description provided.",
                    "stars": repo.get("stargazers_count", 0),
                    "language": repo.get("language") or "Markdown",
                    "url": repo.get("html_url")
                })
                
            return {
                "username": p_data.get("login"),
                "name": p_data.get("name") or p_data.get("login"),
                "avatar_url": p_data.get("avatar_url"),
                "bio": p_data.get("bio") or "Independent Software Developer",
                "public_repos": p_data.get("public_repos", 0),
                "followers": p_data.get("followers", 0),
                "repositories": repositories
            }
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="GitHub API unreachable")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)