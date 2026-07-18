import { useState } from 'react';
import { GraduationCap, FolderKanban, Sparkles, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';

const skills = ['React', 'Python', 'DSA', 'SQL', 'Figma', 'C++'];

function StatCard({ icon: Icon, label, value, sublabel }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:hover:border-white/20 group cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-zinc-500 dark:text-purple-200/70">{label}</span>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-black/5 to-black/[0.02] border border-zinc-300/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:from-white/10 dark:to-white/[0.02] dark:border-white/20 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
          <Icon size={16} strokeWidth={1.75} className="text-zinc-700 dark:text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-rose-300">{value}</p>
      {sublabel && <p className="text-xs text-zinc-500 dark:text-purple-300/50 mt-1">{sublabel}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [taskList, setTaskList] = useState([
    { id: 1, label: 'Finish Thermodynamics assignment', done: true, open: false },
    { id: 2, label: 'Review DSA — Graphs & BFS/DFS', done: false, open: false },
    { id: 3, label: 'Push updates to EngineerHub repo', done: false, open: false },
    { id: 4, label: 'Prep slides for group project review', done: false, open: false },
  ]);

  const toggleTaskDone = (id) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const toggleTaskExpand = (id) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, open: !t.open } : t));
  };

  return (
    <div className="space-y-6 animate-pop-in">
      <div>
        <h1 className="text-xl text-zinc-900 dark:text-white font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-purple-200/70 mt-1">
          Welcome back — here's your progress at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={GraduationCap} label="CGPA" value="8.42" sublabel="+0.12 from last semester" />
        <StatCard icon={FolderKanban} label="Active Projects" value="5" sublabel="2 due this week" />
        <StatCard icon={Sparkles} label="Skills Tracked" value={skills.length} sublabel="3 added this month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Skills Panel */}
        <div className="lg:col-span-1 bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6">
          <h2 className="text-sm text-zinc-900 dark:text-white font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-black/[0.03] border border-black/[0.06] dark:bg-white/[0.04] dark:border-white/[0.08] rounded-full transition-all duration-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 cursor-pointer hover:scale-105 transform"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Expandable Tasks Panel */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm text-zinc-900 dark:text-white font-bold">Daily Tasks</h2>
            <span className="text-xs text-zinc-400 dark:text-purple-300/50 font-medium bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">
              {taskList.filter((t) => t.done).length}/{taskList.length} completed
            </span>
          </div>
          
          <ul className="space-y-2.5">
            {taskList.map((task) => (
              <li 
                key={task.id} 
                className="border border-black/[0.04] dark:border-white/[0.04] rounded-xl overflow-hidden transition-all duration-300 bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
              >
                <div className="flex items-center justify-between p-3 text-sm cursor-pointer select-none">
                  <div className="flex items-center gap-3 flex-1" onClick={() => toggleTaskDone(task.id)}>
                    <button className="transition-transform duration-200 active:scale-75 shrink-0">
                      {task.done ? (
                        <CheckCircle2 size={17} strokeWidth={2} className="text-emerald-500 dark:text-emerald-400 scale-110 transition-transform duration-300" />
                      ) : (
                        <Circle size={17} strokeWidth={1.75} className="text-zinc-400 dark:text-purple-200/40 hover:text-purple-500 transition-colors" />
                      )}
                    </button>
                    <span className={`transition-all duration-300 ${task.done ? 'text-zinc-400 dark:text-purple-300/40 line-through opacity-60' : 'text-zinc-700 dark:text-zinc-200 font-medium'}`}>
                      {task.label}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => toggleTaskExpand(task.id)} 
                    className="p-1 text-zinc-400 dark:text-purple-200/40 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {task.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Smooth Expandable Content Drawer */}
                <div className={`transition-all duration-300 ease-in-out px-9 border-t border-black/[0.02] dark:border-white/[0.02] bg-black/[0.01] dark:bg-white/[0.01] ${task.open ? 'max-h-20 py-2.5 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <p className="text-xs text-zinc-500 dark:text-purple-200/60">
                    Priority Milestone Node. Click checkbox milestone to update completion metrics.
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}