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
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="5" className="stroke-zinc-800" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          className="stroke-white transition-all duration-500 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
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
    } catch (e) {
      // Fail silently
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
    const total = activeRoadmap.stages.reduce((sum, stage) => sum + stage.subjects.length + stage.skills.length, 0);
    const completed = completedItems.size;
    return {
      totalItems: total,
      completedCount: completed,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [activeRoadmap, completedItems]);

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight">Career Roadmaps</h1>
        <p className="text-sm text-zinc-500 mt-1">Pick your domain and get a path to mastery.</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-md pl-3 pr-9 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 cursor-pointer"
            >
              <option value="" disabled className="bg-zinc-950">Select your engineering domain</option>
              {Object.entries(roadmapData).map(([key, value]) => (
                <option key={key} value={key} className="bg-zinc-950">{value.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
          <button
            onClick={handleGenerate}
            disabled={!selectedDomain || isGenerating}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 disabled:bg-zinc-800 text-black disabled:text-zinc-600 disabled:cursor-not-allowed text-sm font-medium rounded-md px-4 py-2 transition-colors"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin text-zinc-600" /> : <Sparkles size={15} />}
            {isGenerating ? 'Generating...' : 'Generate Career Path'}
          </button>
        </div>
      </div>

      {activeRoadmap && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-medium text-white mb-1">{activeRoadmap.label} — Suggested Path</h2>
              <p className="text-xs text-zinc-500">{completedCount} of {totalItems} milestones completed</p>
            </div>
            <ProgressRing percentage={percentage} />
          </div>

          <div className="relative pl-8">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-zinc-800" />
            <div className="space-y-10">
              {activeRoadmap.stages.map((stage, stageIndex) => (
                <div key={stage.phase} className="relative">
                  <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-zinc-950 border-2 border-white" />
                  <h3 className="text-white text-sm font-semibold mb-3">{stage.phase}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3.5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <BookOpen size={14} className="text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-500">Core Subjects</span>
                      </div>
                      <ul className="space-y-1.5">
                        {stage.subjects.map((s, i) => {
                          const key = `${stageIndex}-subject-${i}`;
                          const done = completedItems.has(key);
                          return (
                            <li key={key}>
                              <button onClick={() => toggleItem(key)} className="w-full flex items-start gap-2 text-left group">
                                {done ? <CheckCircle2 size={14} className="text-white shrink-0 mt-0.5" /> : <Circle size={14} className="text-zinc-600 group-hover:text-zinc-400 shrink-0 mt-0.5" />}
                                <span className={`text-xs ${done ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>{s}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3.5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Wrench size={14} className="text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-500">Skills to Learn</span>
                      </div>
                      <ul className="space-y-1.5">
                        {stage.skills.map((s, i) => {
                          const key = `${stageIndex}-skill-${i}`;
                          const done = completedItems.has(key);
                          return (
                            <li key={key}>
                              <button onClick={() => toggleItem(key)} className="w-full flex items-start gap-2 text-left group">
                                {done ? <CheckCircle2 size={14} className="text-white shrink-0 mt-0.5" /> : <Circle size={14} className="text-zinc-600 group-hover:text-zinc-400 shrink-0 mt-0.5" />}
                                <span className={`text-xs ${done ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>{s}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3.5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Rocket size={14} className="text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-500">Target Project</span>
                      </div>
                      <p className="text-xs text-zinc-300">{stage.project}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!activeRoadmap && !isGenerating && (
        <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-xl p-10 text-center">
          <p className="text-sm text-zinc-500">Select a domain above to generate your personalized roadmap.</p>
        </div>
      )}
    </div>
  );
}