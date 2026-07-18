import { NavLink } from 'react-router-dom';
import { navItems } from '../../lib/navConfig';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed z-50 inset-y-0 left-0 w-64 flex flex-col
          bg-white/70 backdrop-blur-2xl border-r border-black/[0.06]
          dark:bg-white/[0.02] dark:border-white/[0.05]
          transition-colors duration-300
          transform transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-black/[0.06] dark:border-white/[0.05] shrink-0">
          <span className="text-zinc-900 dark:text-white font-bold tracking-tight text-[15px]">
            EngineerHub
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-black/[0.05] text-zinc-900 border border-black/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] dark:bg-white/[0.07] dark:text-white dark:border-white/[0.1] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.04] dark:text-zinc-400/80 dark:hover:text-white dark:hover:bg-white/[0.04]'
                  }`
                }
              >
                <Icon size={17} strokeWidth={1.75} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-black/[0.06] dark:border-white/[0.05] shrink-0">
          <p className="px-3 text-xs text-zinc-400 dark:text-zinc-400/50">v1.0 · Phase 2</p>
        </div>
      </aside>
    </>
  );
}