import { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Wrench,
  Rocket,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Circle,
} from 'lucide-react';

const roadmapData = {
  'software-engineering': {
    label: 'Software Engineering',
    stages: [
      {
        phase: 'Year 1 — Foundations',
        subjects: ['Programming Fundamentals (C/C++)', 'Discrete Mathematics', 'Data Structures'],
        skills: ['Git & version control', 'Problem solving (basic DSA)', 'Linux CLI basics'],
        project: 'Build a CLI-based task manager',
      },
      {
        phase: 'Year 2 — Core Systems',
        subjects: ['Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS'],
        skills: ['SQL & schema design', 'REST API design', 'Time/space complexity analysis'],
        project: 'Full-stack CRUD app with auth (React + Node + SQL)',
      },
      {
        phase: 'Year 3 — Specialization',
        subjects: ['Software Engineering Principles', 'Cloud Computing', 'Distributed Systems'],
        skills: ['Docker & containerization', 'CI/CD pipelines', 'System design basics'],
        project: 'Deploy a containerized microservice on cloud infra',
      },
      {
        phase: 'Year 4 — Industry Ready',
        subjects: ['Capstone Project', 'Software Testing', 'Electives (AI/ML or Security)'],
        skills: ['Testing & debugging at scale', 'Code review practices', 'Interview-level DSA'],
        project: 'Ship a production-grade capstone with a live user base',
      },
    ],
  },
  'ece': {
    label: 'Electronics & Communication Engineering',
    stages: [
      {
        phase: 'Year 1 — Foundations',
        subjects: ['Basic Electronics', 'Circuit Theory', 'Engineering Mathematics'],
        skills: ['Breadboarding & soldering', 'Multimeter/oscilloscope use', 'Basic Python for sims'],
        project: 'Design a simple LED-based logic circuit',
      },
      {
        phase: 'Year 2 — Core Systems',
        subjects: ['Analog Electronics', 'Digital Logic Design', 'Signals & Systems'],
        skills: ['SPICE simulation', 'VHDL/Verilog basics', 'PCB design (KiCad)'],
        project: 'Build and simulate a 4-bit ALU on FPGA',
      },
      {
        phase: 'Year 3 — Specialization',
        subjects: ['Microprocessors & Microcontrollers', 'Communication Systems', 'VLSI Design'],
        skills: ['Embedded C', 'ARM/AVR programming', 'RF & antenna basics'],
        project: 'IoT sensor node with wireless data transmission',
      },
      {
        phase: 'Year 4 — Industry Ready',
        subjects: ['Capstone Project', 'Wireless Networks', 'Electives (Robotics or 5G)'],
        skills: ['System-level debugging', 'Datasheet literacy', 'Hardware-software integration'],
        project: 'End-to-end embedded product with a mobile companion app',
      },
    ],
  },
};

const STORAGE_KEY = 'engineerhub-roadmap-progress';

function ProgressRing({ percentage }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="5" className="stroke-black/[0.08] dark:stroke-white/[0.08]" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          className="stroke-zinc-900 dark:stroke-white transition-all duration-500 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zinc-900 dark:text-white">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

export default function Roadmaps() {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedItems, setCompletedItems] = useState(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const { domain, completed } = JSON.parse(saved);
      if (domain && roadmapData[domain]) {
        setSelectedDomain(domain);
        setActiveRoadmap(roadmapData[domain]);
        setCompletedItems(new Set(completed));
      }
    } catch {
      // Corrupted or missing storage — fail silently, user just starts fresh
    }
  }, []);

  useEffect(() => {
    if (!activeRoadmap || !selectedDomain) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        domain: selectedDomain,
        completed: Array.from(completedItems),
      })
    );
  }, [completedItems, activeRoadmap, selectedDomain]);

  const handleGenerate = () => {
    if (!selectedDomain) return;
    setIsGenerating(true);
    setActiveRoadmap(null);
    setCompletedItems(new Set());

    setTimeout(() => {
      setActiveRoadmap(roadmapData[selectedDomain]);
      setIsGenerating(false);
    }, 700);
  };

  const toggleItem = (key) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const { totalItems, completedCount, percentage } = useMemo(() => {
    if (!activeRoadmap) return { totalItems: 0, completedCount: 0, percentage: 0 };

    const total = activeRoadmap.stages.reduce(
      (sum, stage) => sum + stage.subjects.length + stage.skills.length,
      0
    );
    const completed = completedItems.size;

    return {
      totalItems: total,
      completedCount: completed,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [activeRoadmap, completedItems]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl text-zinc-900 dark:text-white font-bold tracking-tight">Career Roadmaps</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400/80 mt-1">
          Pick your domain and get a semester-by-semester path to mastery.
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full appearance-none bg-black/[0.02] border border-black/[0.08] text-zinc-900 focus:border-black/20 focus:ring-black/5 dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/5 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all duration-300 cursor-pointer"
            >
              <option value="" disabled className="bg-white dark:bg-[#03000a]">
                Select your engineering domain
              </option>
              {Object.entries(roadmapData).map(([key, value]) => (
                <option key={key} value={key} className="bg-white dark:bg-[#03000a]">
                  {value.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.75}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedDomain || isGenerating}
            className="flex items-center justify-center gap-2 bg-gradient-to-b from-black/5 to-black/[0.02] hover:from-black/10 hover:to-black/5 disabled:from-black/[0.02] disabled:to-black/[0.02] disabled:text-zinc-400 text-zinc-800 border border-zinc-300/50 shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)] hover:border-zinc-400/50 dark:from-white/10 dark:to-white/[0.02] dark:hover:from-white/15 dark:hover:to-white/5 dark:disabled:from-white/[0.02] dark:disabled:to-white/[0.02] dark:disabled:text-zinc-600 dark:text-white dark:border-white/20 dark:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] dark:hover:border-white/30 disabled:cursor-not-allowed text-sm font-medium rounded-xl px-4 py-2.5 transition-all duration-300 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={15} strokeWidth={2} />
                Generate Career Path
              </>
            )}
          </button>
        </div>
      </div>

      {activeRoadmap && (
        <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 sm:p-8 transition-colors duration-300">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <h2 className="text-sm text-zinc-900 dark:text-white font-bold mb-1">
                {activeRoadmap.label} — Suggested Path
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400/70">
                {completedCount} of {totalItems} milestones completed
              </p>
            </div>
            <ProgressRing percentage={percentage} />
          </div>

          <div className="relative pl-8">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-black/[0.08] dark:bg-white/[0.08]" />

            <div className="space-y-10">
              {activeRoadmap.stages.map((stage, stageIndex) => (
                <div key={stage.phase} className="relative">
                  <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-white dark:bg-[#120018] border-2 border-zinc-900/60 dark:border-white/60" />

                  <h3 className="text-zinc-900 dark:text-white text-sm font-bold mb-3">{stage.phase}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-black/[0.02] border border-black/[0.05] dark:bg-white/[0.04] dark:border-white/[0.05] rounded-xl p-3.5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <BookOpen size={14} strokeWidth={1.75} className="text-zinc-800 dark:text-white" />
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400/80">Core Subjects</span>
                      </div>
                      <ul className="space-y-1.5">
                        {stage.subjects.map((s, i) => {
                          const key = `${stageIndex}-subject-${i}`;
                          const done = completedItems.has(key);
                          return (
                            <li key={key}>
                              <button
                                onClick={() => toggleItem(key)}
                                className="w-full flex items-start gap-2 text-left group"
                              >
                                {done ? (
                                  <CheckCircle2 size={14} strokeWidth={1.75} className="text-zinc-900 dark:text-white shrink-0 mt-0.5" />
                                ) : (
                                  <Circle
                                    size={14}
                                    strokeWidth={1.75}
                                    className="text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400 shrink-0 mt-0.5 transition-colors"
                                  />
                                )}
                                <span
                                  className={`text-xs transition-colors ${
                                    done ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-700 dark:text-zinc-200'
                                  }`}
                                >
                                  {s}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="bg-black/[0.02] border border-black/[0.05] dark:bg-white/[0.04] dark:border-white/[0.05] rounded-xl p-3.5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Wrench size={14} strokeWidth={1.75} className="text-zinc-800 dark:text-white" />
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400/80">Skills to Learn</span>
                      </div>
                      <ul className="space-y-1.5">
                        {stage.skills.map((s, i) => {
                          const key = `${stageIndex}-skill-${i}`;
                          const done = completedItems.has(key);
                          return (
                            <li key={key}>
                              <button
                                onClick={() => toggleItem(key)}
                                className="w-full flex items-start gap-2 text-left group"
                              >
                                {done ? (
                                  <CheckCircle2 size={14} strokeWidth={1.75} className="text-zinc-900 dark:text-white shrink-0 mt-0.5" />
                                ) : (
                                  <Circle
                                    size={14}
                                    strokeWidth={1.75}
                                    className="text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400 shrink-0 mt-0.5 transition-colors"
                                  />
                                )}
                                <span
                                  className={`text-xs transition-colors ${
                                    done ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-700 dark:text-zinc-200'
                                  }`}
                                >
                                  {s}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="bg-black/[0.02] border border-black/[0.05] dark:bg-white/[0.04] dark:border-white/[0.05] rounded-xl p-3.5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Rocket size={14} strokeWidth={1.75} className="text-zinc-800 dark:text-white" />
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400/80">Target Project</span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-200">{stage.project}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!activeRoadmap && !isGenerating && (
        <div className="bg-black/[0.02] border border-dashed border-black/[0.1] dark:bg-white/[0.02] dark:border-white/[0.1] rounded-2xl p-10 text-center transition-colors duration-300">
          <p className="text-sm text-zinc-500 dark:text-zinc-400/80">
            Select a domain above to generate your personalized roadmap.
          </p>
        </div>
      )}
    </div>
  );
}