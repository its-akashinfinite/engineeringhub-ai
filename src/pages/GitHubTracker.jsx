import { useState } from 'react';
import { Search, Loader2, AlertCircle, MapPin, Users, GitFork, Star, Link as LinkIcon } from 'lucide-react';

const GITHUB_API_BASE = 'https://api.github.com/users';

function RepoCard({ repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-5 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-white truncate">{repo.name}</h3>
        {repo.language && (
          <span className="text-[10px] text-zinc-300 bg-white/[0.05] border border-white/[0.08] rounded-full px-2 py-0.5 whitespace-nowrap shrink-0">
            {repo.language}
          </span>
        )}
      </div>
      <p className="text-xs text-zinc-400/70 mb-3 line-clamp-2 min-h-[2rem]">
        {repo.description || 'No description provided.'}
      </p>
      <div className="flex items-center gap-4 text-xs text-zinc-400/80">
        <span className="flex items-center gap-1">
          <Star size={12} strokeWidth={1.75} />
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <GitFork size={12} strokeWidth={1.75} />
          {repo.forks_count}
        </span>
      </div>
    </a>
  );
}

export default function GitHubTracker() {
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);

  const handleFetchProfile = async (e) => {
    e.preventDefault();
    const trimmed = usernameInput.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setProfile(null);
    setRepos([]);

    try {
      const [profileRes, reposRes] = await Promise.all([
        fetch(`${GITHUB_API_BASE}/${encodeURIComponent(trimmed)}`),
        fetch(`${GITHUB_API_BASE}/${encodeURIComponent(trimmed)}/repos?sort=updated&per_page=8`),
      ]);

      if (!profileRes.ok) {
        throw new Error(
          profileRes.status === 404
            ? `GitHub user '${trimmed}' not found.`
            : `Request failed (${profileRes.status})`
        );
      }

      const profileData = await profileRes.json();
      const reposData = reposRes.ok ? await reposRes.json() : [];

      setProfile(profileData);
      setRepos(reposData);
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Could not reach GitHub. Check your connection and try again.'
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl text-white font-bold tracking-tight">
          GitHub Portfolio
        </h1>
        <p className="text-sm text-zinc-400/80 mt-1">
          Pull a live snapshot of your public repositories and profile.
        </p>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6">
        <form onSubmit={handleFetchProfile} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              strokeWidth={1.75}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter your GitHub username"
              className="w-full bg-white/[0.03] border border-white/[0.1] text-white rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5 transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={!usernameInput.trim() || isLoading}
            className="flex items-center justify-center gap-2 bg-gradient-to-b from-white/10 to-white/[0.02] hover:from-white/15 hover:to-white/5 disabled:from-white/[0.02] disabled:to-white/[0.02] disabled:text-zinc-600 disabled:cursor-not-allowed text-white border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-white/30 text-sm font-medium rounded-xl px-4 py-2.5 transition-all duration-300 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                Fetching...
              </>
            ) : (
              'Fetch Profile'
            )}
          </button>
        </form>

        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mt-4">
            <AlertCircle size={15} strokeWidth={1.75} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
      </div>

      {profile && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <img
              src={profile.avatar_url}
              alt={`${profile.login} avatar`}
              className="w-20 h-20 rounded-2xl border border-white/[0.1] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white">
                {profile.name || profile.login}
              </h2>
              <p className="text-sm text-zinc-400/80 mb-2">@{profile.login}</p>
              {profile.bio && (
                <p className="text-sm text-zinc-300 mb-3">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-zinc-400/80">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} strokeWidth={1.75} />
                    {profile.location}
                  </span>
                )}
                {profile.blog && (
                  <a
                    href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <LinkIcon size={13} strokeWidth={1.75} />
                    {profile.blog}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Users size={13} strokeWidth={1.75} />
                  {profile.followers} followers
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto shrink-0">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-center">
                <p className="text-lg font-bold text-white">{profile.public_repos}</p>
                <p className="text-[10px] text-zinc-400/70 mt-0.5">Repos</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-center">
                <p className="text-lg font-bold text-white">{profile.followers}</p>
                <p className="text-[10px] text-zinc-400/70 mt-0.5">Followers</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-center">
                <p className="text-lg font-bold text-white">{profile.following}</p>
                <p className="text-[10px] text-zinc-400/70 mt-0.5">Following</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div>
          <h2 className="text-sm text-white font-bold mb-3">Recent Repositories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}