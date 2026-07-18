import { useState } from 'react';
import { User, Palette, LogOut, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function Settings() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
  });

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl text-zinc-900 dark:text-white font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400/80 mt-1">
          Manage your profile, appearance, and account.
        </p>
      </div>

      {/* Profile Card Deck */}
      <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} strokeWidth={1.75} className="text-zinc-800 dark:text-white" />
          <h2 className="text-sm text-zinc-900 dark:text-white font-bold">Profile Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400/80 mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full bg-black/[0.02] border border-black/[0.08] text-zinc-900 focus:border-black/20 focus:ring-black/5 dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400/80 mb-1.5">
              Institutional Email
            </label>
            <div className="relative">
              <Mail size={15} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full bg-black/[0.02] border border-black/[0.08] text-zinc-900 focus:border-black/20 focus:ring-black/5 dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all duration-300"
              />
            </div>
          </div>

          <button className="text-sm font-medium bg-gradient-to-b from-black/5 to-black/[0.02] hover:from-black/10 hover:to-black/5 text-zinc-800 border border-zinc-300/50 shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)] hover:border-zinc-400/50 dark:from-white/10 dark:to-white/[0.02] dark:hover:from-white/15 dark:hover:to-white/5 dark:text-white dark:border-white/20 dark:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] dark:hover:border-white/30 rounded-xl px-4 py-2.5 transition-all duration-300">
            Save Changes
          </button>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} strokeWidth={1.75} className="text-zinc-800 dark:text-white" />
          <h2 className="text-sm text-zinc-900 dark:text-white font-bold">Appearance</h2>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-zinc-800 dark:text-zinc-100">Dark Mode</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400/70 mt-0.5">
              Toggle between dark and light layout borders
            </p>
          </div>
          
          {/* BULLETPROOF FLEX LAYOUT INTERACTIVE TRACK */}
          <button
            onClick={toggleTheme}
            className={`w-11 h-6 rounded-full border p-0.5 transition-all duration-300 shrink-0 flex items-center ${
              theme === 'dark'
                ? 'bg-gradient-to-b from-white/20 to-white/5 border-white/30 justify-end'
                : 'bg-gradient-to-b from-black/10 to-black/5 border-black/10 justify-start'
            }`}
            aria-label="Toggle dark mode"
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-all duration-300" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white/70 backdrop-blur-xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 transition-colors duration-300">
        <h2 className="text-sm text-zinc-900 dark:text-white font-bold mb-1">Account Actions</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400/80 mb-4">
          Signing out will end your current session on this device.
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/20 text-sm font-medium rounded-xl px-4 py-2.5 transition-all duration-300"
        >
          <LogOut size={15} strokeWidth={1.75} />
          Sign Out
        </button>
      </div>
    </div>
  );
}