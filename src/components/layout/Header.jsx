import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-black/[0.06] dark:border-white/[0.05] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl sticky top-0 z-30 transition-colors duration-300">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.04] dark:text-zinc-400/80 dark:hover:text-white dark:hover:bg-white/[0.05] transition-all duration-300"
        aria-label="Open menu"
      >
        <Menu size={20} strokeWidth={1.75} />
      </button>

      <div className="flex-1" />

      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.04] dark:text-zinc-400/80 dark:hover:text-white dark:hover:bg-white/[0.05] transition-all duration-300"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun size={18} strokeWidth={1.75} />
        ) : (
          <Moon size={18} strokeWidth={1.75} />
        )}
      </button>
    </header>
  );
}