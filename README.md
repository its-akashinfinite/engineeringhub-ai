# EngineerHub AI — Signal Processing Workspace Backend

FastAPI service implementing spectral-subtraction audio denoising for the
"Signal Processing Workspace" module. Mirrors a classic MATLAB voice
de-noising flow: STFT → estimate noise magnitude → subtract → floor →
inverse STFT.

## 1. Install dependencies

Requires **Python 3.10+**.

```bash
# from inside this directory
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

`soundfile` depends on the system `libsndfile` library. It's bundled on
most platforms via the `soundfile` wheel, but if you hit an import error:

```bash
# Debian/Ubuntu
sudo apt-get install libsndfile1

# macOS
brew install libsndfile
```

## 2. Run locally

```bash
uvicorn main:app --reload --port 8000
```

Interactive API docs (Swagger UI) will be live at:
`http://localhost:8000/docs`

## 3. Endpoint reference

### `POST /api/process-audio`

**Content-Type:** `multipart/form-data`

| Field                  | Type   | Required | Description                                   |
|------------------------|--------|----------|------------------------------------------------|
| `file`                 | file   | yes      | `.wav` audio buffer                            |
| `threshold_percentage` | float  | no       | 0–100 noise subtraction aggressiveness (default 50) |

**Example request (curl):**

```bash
curl -X POST http://localhost:8000/api/process-audio \
  -F "file=@sample_noisy_voice.wav" \
  -F "threshold_percentage=65"
```

**Response shape:**

```json
{
  "metadata": {
    "job_id": "b3f1...",
    "sample_rate": 44100,
    "duration_seconds": 4.213,
    "channels": 1,
    "threshold_percentage": 65,
    "noise_floor_db": -42.18,
    "average_attenuation_db": 6.72,
    "processing_time_ms": 118.4
  },
  "original_waveform": [0.0021, -0.0044, ...],
  "processed_waveform": [0.0011, -0.0019, ...],
  "processed_audio_base64": "UklGRi...",
  "audio_mime_type": "audio/wav"
}
```

- `original_waveform` / `processed_waveform` are downsampled to ~800 points
  each (peak-preserving block-max sampling) — enough for a crisp visualizer
  chart without shipping the full sample array over JSON.
- `processed_audio_base64` is a full-quality 16-bit PCM WAV, base64-encoded.
  Decode it client-side into a `Blob` to build a playable `<audio>` element.

## 4. Calling it from the React frontend

```javascript
async function processAudio(file, thresholdPercentage) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('threshold_percentage', thresholdPercentage);

  const response = await fetch('/api/process-audio', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const { detail } = await response.json();
    throw new Error(detail || 'Audio processing failed');
  }

  const result = await response.json();

  // Decode base64 WAV into a playable Blob URL
  const byteChars = atob(result.processed_audio_base64);
  const byteNumbers = Array.from(byteChars, (c) => c.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const audioBlob = new Blob([byteArray], { type: result.audio_mime_type });
  const audioUrl = URL.createObjectURL(audioBlob);

  return {
    metadata: result.metadata,
    originalWaveform: result.original_waveform,
    processedWaveform: result.processed_waveform,
    audioUrl,
  };
}
```

## 5. Deploying alongside your Vercel frontend

Vercel's Node runtime doesn't run Python/FastAPI natively as a long-lived
server — you have two clean options:

**Option A — Separate deployment (recommended for this workload):**
Deploy this FastAPI service on Railway, Render, or Fly.io (all support
long-running Python processes, which suits STFT/ISTFT compute better than
a serverless cold-start model). Point your React app's API base URL at
that service, and add its origin to `ALLOWED_ORIGINS` in `main.py`.

**Option B — Vercel Python Serverless Function:**
Vercel does support Python functions (`/api/*.py` with a `handler`), but
cold starts plus the `numpy`/`scipy` package size (~100MB combined) make
this noticeably slower per-request than a persistent server. Only worth it
if you want everything on one Vercel project and can tolerate the latency.

Either way — before going to production, replace the placeholder in
`ALLOWED_ORIGINS` inside `main.py` with your actual deployed frontend
domain(s).
