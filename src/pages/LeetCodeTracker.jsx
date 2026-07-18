import { useState } from 'react';
import { Search, Loader2, AlertCircle, Trophy, Target } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/leetcode';

function ProgressBar({ label, solved, total, colorClass }) {
  const percentage = total > 0 ? (solved / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400/80">{label}</span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {solved} / {total}
        </span>
      </div>
      <div className="w-full h-2 bg-black/[0.04] border border-black/[0.05] dark:bg-white/[0.04] dark:border-white/[0.05] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-5 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} strokeWidth={1.75} className="text-zinc-800 dark:text-white" />
        <span className="text-xs text-zinc-500 dark:text-zinc-400/70">{label}</span>
      </div>
      <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}

function GlassSparkline({ solved, total }) {
  const percentage = total > 0 ? (solved / total) * 100 : 0;
  const width = 400;
  const height = 60;

  const steps = 24;
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const x = (i / steps) * width;
    const eased = Math.pow(i / steps, 1.4) * percentage;
    const y = height - (eased / 100) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-14">
      <defs>
        <linearGradient id="sparkline-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkline-fade)" stroke="none" className="text-zinc-800 dark:text-white" />
      <path
        d={linePath}
        fill="none"
        className="stroke-zinc-800 dark:stroke-white"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function LeetCodeTracker() {
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const handleFetchStats = async (e) => {
    e.preventDefault();
    const trimmed = usernameInput.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setStats(null);

    try {
      const response = await fetch(`${API_BASE}/${encodeURIComponent(trimmed)}`);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.detail || `Request failed (${response.status})`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Could not reach the backend server. Is it running on port 8000?'
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl text-zinc-900 dark:text-white font-bold tracking-tight">LeetCode Tracker</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400/80 mt-1">
          Pull your live problem-solving stats straight from LeetCode.
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 transition-colors duration-300">
        <form onSubmit={handleFetchStats} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter your LeetCode username"
              className="w-full bg-black/[0.02] border border-black/[0.08] text-zinc-900 placeholder:text-zinc-400 focus:border-black/20 focus:ring-black/5 dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white/30 dark:focus:ring-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={!usernameInput.trim() || isLoading}
            className="flex items-center justify-center gap-2 bg-gradient-to-b from-black/5 to-black/[0.02] hover:from-black/10 hover:to-black/5 disabled:from-black/[0.02] disabled:to-black/[0.02] disabled:text-zinc-400 text-zinc-800 border border-zinc-300/50 shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)] hover:border-zinc-400/50 dark:from-white/10 dark:to-white/[0.02] dark:hover:from-white/15 dark:hover:to-white/5 dark:disabled:from-white/[0.02] dark:disabled:to-white/[0.02] dark:disabled:text-zinc-600 dark:text-white dark:border-white/20 dark:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] dark:hover:border-white/30 disabled:cursor-not-allowed text-sm font-medium rounded-xl px-4 py-2.5 transition-all duration-300 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                Fetching...
              </>
            ) : (
              'Fetch Stats'
            )}
          </button>
        </form>

        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mt-4">
            <AlertCircle size={15} strokeWidth={1.75} className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {stats && (
        <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 space-y-6 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-zinc-900 dark:text-white font-bold">@{stats.username}</h2>
            {stats.global_ranking && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400/70">
                Global Rank #{stats.global_ranking.toLocaleString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard icon={Target} label="Total Solved" value={stats.total_solved} />
            <StatCard
              icon={Trophy}
              label="Global Ranking"
              value={stats.global_ranking ? `#${stats.global_ranking.toLocaleString()}` : '—'}
            />
            <StatCard
              icon={Target}
              label="Solve Rate"
              value={stats.acceptance_rate ? `${stats.acceptance_rate}%` : '—'}
            />
          </div>

          <div className="bg-black/[0.02] border border-black/[0.05] dark:bg-white/[0.02] dark:border-white/[0.05] rounded-xl p-4">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400/70 mb-1">Solve Trajectory</p>
            <GlassSparkline solved={stats.total_solved} total={stats.total_questions} />
          </div>

          <div className="space-y-4">
            <ProgressBar
              label="Easy"
              solved={stats.breakdown.easy_solved}
              total={stats.breakdown.easy_total}
              colorClass="bg-emerald-500/80 dark:bg-emerald-400/80"
            />
            <ProgressBar
              label="Medium"
              solved={stats.breakdown.medium_solved}
              total={stats.breakdown.medium_total}
              colorClass="bg-amber-500/80 dark:bg-amber-400/80"
            />
            <ProgressBar
              label="Hard"
              solved={stats.breakdown.hard_solved}
              total={stats.breakdown.hard_total}
              colorClass="bg-rose-500/80 dark:bg-rose-400/80"
            />
          </div>
        </div>
      )}
    </div>
  );
}