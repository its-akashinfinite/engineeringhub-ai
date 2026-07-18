import { useState, useRef } from 'react';
import { UploadCloud, AudioLines, Loader2, AlertCircle, Play, Pause, Gauge, CheckCircle } from 'lucide-react';

function WaveformChart({ data, label, colorClass }) {
  if (!data || data.length < 2) {
    return (
      <div className="h-28 flex items-center justify-center border border-dashed border-black/[0.1] bg-black/[0.01] dark:border-white/25 dark:bg-white/[0.01] rounded-xl transition-all">
        <p className="text-xs text-zinc-400 dark:text-purple-300/40">No active signal trace</p>
      </div>
    );
  }
  const width = 600;
  const height = 100;
  const midY = height / 2;
  const maxAbs = Math.max(...data.map((v) => Math.abs(v)), 0.0001);
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = midY - (value / maxAbs) * (midY - 4);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  return (
    <div className="animate-pop-in">
      <p className="text-xs font-medium text-zinc-500 dark:text-purple-200/70 mb-2">{label}</p>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-28 bg-black/[0.02] border border-black/[0.06] dark:bg-white/[0.02] dark:border-white/[0.08] rounded-xl shadow-inner">
        <line x1="0" y1={midY} x2={width} y2={midY} className="stroke-black/[0.08] dark:stroke-white/[0.08]" strokeWidth="1" />
        <polyline points={points} fill="none" strokeWidth="1.5" className={`${colorClass} animate-signal`} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export default function AudioProcessor() {
  const [file, setFile] = useState(null);
  const [threshold, setThreshold] = useState(50);
  const [statusState, setStatusState] = useState('idle'); // idle -> processing -> completed
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith('.wav')) {
      setError('Only .wav audio objects are verified.');
      setFile(null);
      return;
    }
    setError(null);
    setResult(null);
    setStatusState('idle');
    setFile(selected);
  };

  const handleProcess = () => {
    if (!file) return;
    setStatusState('processing');
    setError(null);
    setResult(null);

    // Simulate DSP script latency with state updates
    setTimeout(() => {
      // Mocked waveform trace vectors matching the visual specs
      const mockOrig = Array.from({ length: 60 }, () => Math.sin(Math.random() * Math.PI) * (Math.random() - 0.5));
      const mockProc = mockOrig.map(v => v * (threshold / 100));

      setResult({
        metadata: { sample_rate: 44100, duration_seconds: 4.2, noise_floor_db: -52, processing_time_ms: 380 },
        originalWaveform: mockOrig,
        processedWaveform: mockProc,
        audioUrl: '#'
      });
      setStatusState('completed');
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-pop-in">
      <div>
        <h1 className="text-xl text-zinc-900 dark:text-white font-bold tracking-tight">Signal Processing Workspace</h1>
        <p className="text-sm text-zinc-500 dark:text-purple-200/70 mt-1">
          Upload recording and attenuate ambient noise components via spectral subtraction.
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 space-y-5">
        <div>
          <input ref={fileInputRef} type="file" accept=".wav" onChange={handleFileChange} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-black/[0.1] bg-black/[0.01] hover:bg-black/[0.03] dark:border-white/20 dark:bg-white/[0.01] dark:hover:bg-white/[0.03] rounded-xl py-8 transition-all duration-300 hover:scale-[1.01] active:scale-95 group"
          >
            <UploadCloud size={22} className="text-zinc-500 dark:text-purple-200/60 transition-transform group-hover:-translate-y-1" />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {file ? file.name : 'Click to select track file (.wav)'}
            </p>
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-zinc-500 dark:text-purple-200/70">Subtraction Threshold</label>
            <span className="text-xs font-bold text-zinc-900 dark:text-white">{threshold}%</span>
          </div>
          <input type="range" min="0" max="100" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full accent-purple-600 dark:accent-white cursor-pointer" />
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 animate-pop-in">
            <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        {/* FEEDBACK STATE BUTTON SWITCH */}
        <button
          onClick={handleProcess}
          disabled={!file || statusState === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-black/5 to-black/[0.02] dark:from-white/10 dark:to-white/[0.02] text-zinc-800 dark:text-white border border-zinc-300/50 dark:border-white/20 shadow-md hover:border-zinc-400 dark:hover:border-white/40 disabled:opacity-50 text-sm font-medium rounded-xl py-2.5 transition-all duration-300 transform active:scale-98 glass-btn-glow"
        >
          {statusState === 'idle' && (
            <>
              <AudioLines size={16} />
              <span>Run Spectral Processing</span>
            </>
          )}
          {statusState === 'processing' && (
            <>
              <Loader2 size={16} className="animate-spin text-purple-500 dark:text-rose-300" />
              <span className="animate-pulse">Analyzing Signal Harmonics...</span>
            </>
          )}
          {statusState === 'completed' && (
            <>
              <CheckCircle size={16} className="text-emerald-500 dark:text-emerald-400 scale-110" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Trace Attenuated ✓</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 space-y-6 animate-pop-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricPill label="Sample Rate" value="44100 Hz" />
            <MetricPill label="Duration" value="4.2s" />
            <MetricPill label="Noise Floor" value="-52 dB" />
            <MetricPill label="Latency Trace" value="380ms" />
          </div>

          <div className="space-y-4">
            <WaveformChart data={result.originalWaveform} label="Input Spectrum Profile" colorClass="stroke-zinc-400 dark:stroke-purple-300/40" />
            <WaveformChart data={result.processedWaveform} label="Denoised Output Trace" colorClass="stroke-purple-600 dark:stroke-rose-400" />
          </div>
        </div>
      )}
    </div>
  );
}

function MetricPill({ label, value }) {
  return (
    <div className="bg-black/[0.02] border border-black/[0.06] dark:bg-white/[0.03] dark:border-white/[0.08] rounded-xl px-3 py-2 transition-transform duration-300 hover:scale-105">
      <p className="text-[10px] text-zinc-500 dark:text-purple-300/60 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}