import { useState } from 'react';
import { Circle, Clock, CheckCircle2, Cpu, Radio, Code2, Plus, ArrowRight } from 'lucide-react';

const initialColumns = {
  todo: {
    title: 'Backlog',
    icon: Circle,
    color: 'text-zinc-500',
    items: [
      { id: 'p1', title: 'PCB Design for IoT Node', tag: 'Hardware', icon: Cpu, urgency: 'Medium' },
      { id: 'p2', title: 'Solar Panel Efficiency Tracker', tag: 'Embedded', icon: Radio, urgency: 'Low' },
    ],
  },
  inProgress: {
    title: 'In Progress',
    icon: Clock,
    color: 'text-amber-500',
    items: [
      { id: 'p3', title: 'MATLAB Voice De-noising Tool', tag: 'Signal Processing', icon: Radio, urgency: 'High' },
      { id: 'p4', title: 'EngineerHub AI Dashboard', tag: 'Software', icon: Code2, urgency: 'High' },
    ],
  },
  completed: {
    title: 'Shipped',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    items: [
      { id: 'p5', title: 'Line-Following Robot (Arduino)', tag: 'Robotics', icon: Cpu, urgency: 'Completed' },
    ],
  },
};

const columnOrder = ['todo', 'inProgress', 'completed'];

function ProjectCard({ project, onAdvance, isLast }) {
  const Icon = project.icon;
  
  const urgencyColors = {
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Low: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300 group shadow-lg shadow-black/20 flex flex-col justify-between min-h-[130px]">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${urgencyColors[project.urgency]}`}>
            {project.urgency}
          </span>
          <span className="text-[10px] font-medium text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 px-2 py-0.5 rounded-md">
            {project.tag}
          </span>
        </div>
        <p className="text-sm text-zinc-100 font-medium tracking-tight leading-relaxed group-hover:text-white transition-colors">
          {project.title}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/60">
        <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
          <Icon size={12} />
        </div>
        {!isLast && (
          <button
            onClick={() => onAdvance(project.id)}
            className="text-[11px] text-zinc-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 flex items-center gap-1 font-medium transform translate-x-1 group-hover:translate-x-0"
          >
            Advance <ArrowRight size={12} />
          </button>
        )}
      </div>
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
      
      if(toKey === 'completed') project.urgency = 'Completed';

      return {
        ...prev,
        [fromKey]: { ...prev[fromKey], items: prev[fromKey].items.filter((item) => item.id !== projectId) },
        [toKey]: { ...prev[toKey], items: [...prev[toKey].items, project] },
      };
    });
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto px-2 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/60">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Project Board
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Track architectural stages from hardware simulation to deployment builds.</p>
        </div>
        <button className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-lg px-4 py-2.5 shadow-lg shadow-white/5 active:scale-98 transition-all shrink-0">
          <Plus size={14} strokeWidth={2.5} />
          Create Board Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {columnOrder.map((key) => {
          const column = columns[key];
          const ColIcon = column.icon;
          return (
            <div key={key} className="bg-zinc-950/40 border border-zinc-850/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-900 px-1">
                <div className="flex items-center gap-2">
                  <ColIcon size={13} className={column.color} />
                  <h2 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">{column.title}</h2>
                </div>
                <span className="text-[10px] text-zinc-500 font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                  {column.items.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[250px] transition-all duration-300">
                {column.items.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onAdvance={advanceProject}
                    isLast={key === 'completed'}
                  />
                ))}

                {column.items.length === 0 && (
                  <div className="border border-dashed border-zinc-850 rounded-xl py-12 text-center flex flex-col items-center justify-center bg-zinc-900/10">
                    <p className="text-xs text-zinc-650 font-medium">No active iterations</p>
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