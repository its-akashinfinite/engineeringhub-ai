import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-surface-border bg-surface/80 backdrop-blur-sm sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} strokeWidth={1.75} />
      </button>

      <div className="flex-1" />

      <button
        onClick={toggleTheme}
        className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
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