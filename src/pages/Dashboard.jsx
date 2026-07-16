import { GraduationCap, FolderKanban, Sparkles, CheckCircle2, Circle } from 'lucide-react';

const skills = ['React', 'Python', 'DSA', 'SQL', 'Figma', 'C++'];

const tasks = [
  { id: 1, label: 'Finish Thermodynamics assignment', done: true },
  { id: 2, label: 'Review DSA — Graphs & BFS/DFS', done: false },
  { id: 3, label: 'Push updates to EngineerHub repo', done: false },
  { id: 4, label: 'Prep slides for group project review', done: false },
];

function StatCard({ icon: Icon, label, value, sublabel }) {
  return (
    <div className="bg-surface-raised border border-surface-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
          <Icon size={16} strokeWidth={1.75} className="text-accent" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-white tracking-tight">{value}</p>
      {sublabel && <p className="text-xs text-gray-500 mt-1">{sublabel}</p>}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back — here&apos;s your progress at a glance.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={GraduationCap}
          label="CGPA"
          value="8.42"
          sublabel="+0.12 from last semester"
        />
        <StatCard
          icon={FolderKanban}
          label="Active Projects"
          value="5"
          sublabel="2 due this week"
        />
        <StatCard
          icon={Sparkles}
          label="Skills Tracked"
          value={skills.length}
          sublabel="3 added this month"
        />
      </div>

      {/* Lower section: Skills + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Skills chips card */}
        <div className="lg:col-span-1 bg-surface-raised border border-surface-border rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 text-xs font-medium text-gray-300 bg-white/5 border border-surface-border rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Daily tasks card */}
        <div className="lg:col-span-2 bg-surface-raised border border-surface-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Daily Tasks</h2>
            <span className="text-xs text-gray-500">
              {tasks.filter((t) => t.done).length}/{tasks.length} done
            </span>
          </div>
          <ul className="space-y-2.5">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 text-sm"
              >
                {task.done ? (
                  <CheckCircle2
                    size={17}
                    strokeWidth={1.75}
                    className="text-accent shrink-0"
                  />
                ) : (
                  <Circle
                    size={17}
                    strokeWidth={1.75}
                    className="text-gray-600 shrink-0"
                  />
                )}
                <span
                  className={
                    task.done
                      ? 'text-gray-500 line-through'
                      : 'text-gray-300'
                  }
                >
                  {task.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}