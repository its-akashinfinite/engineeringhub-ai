import { useState } from 'react';
import { Circle, Clock, CheckCircle2, Cpu, Radio, Code2, Plus } from 'lucide-react';

const initialColumns = {
  todo: {
    title: 'To Do',
    icon: Circle,
    items: [
      { id: 'p1', title: 'PCB Design for IoT Node', tag: 'Hardware', icon: Cpu },
      { id: 'p2', title: 'Solar Panel Efficiency Tracker', tag: 'Embedded', icon: Radio },
    ],
  },
  inProgress: {
    title: 'In Progress',
    icon: Clock,
    items: [
      { id: 'p3', title: 'MATLAB Voice De-noising Tool', tag: 'Signal Processing', icon: Radio },
      { id: 'p4', title: 'EngineerHub AI Dashboard', tag: 'Software', icon: Code2 },
    ],
  },
  completed: {
    title: 'Completed',
    icon: CheckCircle2,
    items: [
      { id: 'p5', title: 'Line-Following Robot (Arduino)', tag: 'Robotics', icon: Cpu },
    ],
  },
};

const columnOrder = ['todo', 'inProgress', 'completed'];

function ProjectCard({ project, onAdvance, isLast }) {
  const Icon = project.icon;
  return (
    <div className="bg-black/[0.02] border border-black/[0.05] hover:border-zinc-400/50 dark:bg-white/[0.04] dark:border-white/[0.05] dark:hover:border-white/20 rounded-xl p-3.5 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-black/5 to-black/[0.02] border border-zinc-300/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:from-white/10 dark:to-white/[0.02] dark:border-white/20 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0">
          <Icon size={14} strokeWidth={1.75} className="text-zinc-700 dark:text-white" />
        </div>
        <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400/80 bg-black/[0.03] dark:bg-white/[0.04] px-2 py-0.5 rounded-full whitespace-nowrap">
          {project.tag}
        </span>
      </div>
      <p className="text-sm text-zinc-800 dark:text-zinc-100 font-medium leading-snug mb-3">{project.title}</p>
      {!isLast && (
        <button
          onClick={() => onAdvance(project.id)}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400/70 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
          Move to next stage →
        </button>
      )}
    </div>
  );
}

export default function Projects() {
  const [columns, setColumns] = useState(initialColumns);

  const advanceProject = (projectId) => {
    setColumns((prev) => {
      const currentIndex = columnOrder.findIndex((key) =>
        prev[key].items.some((item) => item.id === projectId)
      );
      if (currentIndex === -1 || currentIndex === columnOrder.length - 1) return prev;

      const fromKey = columnOrder[currentIndex];
      const toKey = columnOrder[currentIndex + 1];
      const project = prev[fromKey].items.find((item) => item.id === projectId);

      return {
        ...prev,
        [fromKey]: {
          ...prev[fromKey],
          items: prev[fromKey].items.filter((item) => item.id !== projectId),
        },
        [toKey]: {
          ...prev[toKey],
          items: [...prev[toKey].items, project],
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl text-zinc-900 dark:text-white font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400/80 mt-1">
            Track your engineering builds from idea to shipped.
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-gradient-to-b from-black/5 to-black/[0.02] hover:from-black/10 hover:to-black/5 text-zinc-800 border border-zinc-300/50 shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)] hover:border-zinc-400/50 dark:from-white/10 dark:to-white/[0.02] dark:hover:from-white/15 dark:hover:to-white/5 dark:text-white dark:border-white/20 dark:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] dark:hover:border-white/30 text-sm font-medium rounded-xl px-4 py-2.5 transition-all duration-300">
          <Plus size={15} strokeWidth={2} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columnOrder.map((key) => {
          const column = columns[key];
          const ColIcon = column.icon;
          return (
            <div key={key} className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-4 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <ColIcon size={14} strokeWidth={1.75} className="text-zinc-500 dark:text-zinc-400/80" />
                  <h2 className="text-sm text-zinc-900 dark:text-white font-bold">{column.title}</h2>
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">{column.items.length}</span>
              </div>

              <div className="space-y-2.5 min-h-[80px]">
                {column.items.map((project) => (
                  <ProjectCard key={project.id} project={project} onAdvance={advanceProject} isLast={key === 'completed'} />
                ))}

                {column.items.length === 0 && (
                  <div className="border border-dashed border-black/[0.1] dark:border-white/[0.1] rounded-xl py-6 text-center">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">No projects here yet</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}