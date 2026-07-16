import { useState } from 'react';
import { User, ShieldAlert, LogOut, Mail, Settings2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState({
    name: 'Jai Aakash',
    email: 'aakash@university.edu',
  });

  return (
    <div className="space-y-8 max-w-3xl mx-auto text-white px-2 animate-in fade-in duration-500">
      <div className="pb-5 border-b border-zinc-800/60">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          System Preferences
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Configure workspace variables, execution environment, and authorization state.</p>
      </div>

      {/* Profile Control */}
      <div className="bg-zinc-950/40 border border-zinc-850 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-zinc-900">
          <User size={15} className="text-zinc-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Identity Attributes</h2>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label className="text-xs font-medium text-zinc-400">System Username</label>
            <div className="sm:col-span-2">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label className="text-xs font-medium text-zinc-400">Institutional Gateway</label>
            <div className="sm:col-span-2 relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all font-mono"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button className="text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-lg px-4 py-2 transition-all active:scale-98">
              Update Context
            </button>
          </div>
        </div>
      </div>

      {/* Meta State Details */}
      <div className="bg-zinc-950/40 border border-zinc-850 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-900">
          <Settings2 size={15} className="text-zinc-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Engine Meta</h2>
        </div>
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-xs font-medium text-zinc-300">Monochrome Framework</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Varnished Zinc micro-borders forced active across all viewport hooks.</p>
          </div>
          <span className="text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 rounded-md">
            Active v1.0
          </span>
        </div>
      </div>

      {/* Danger Management Area */}
      <div className="bg-zinc-950/20 border border-red-950/30 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert size={15} className="text-red-400/80" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-red-400/80">Termination Actions</h2>
        </div>
        <p className="text-xs text-zinc-500 mb-5 leading-relaxed">Closing this configuration context will drop your active validation session variables instantly.</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-950/20 hover:bg-red-900/20 border border-red-900/30 text-red-400 text-xs font-semibold rounded-lg px-4 py-2.5 transition-all active:scale-98 shadow-md"
        >
          <LogOut size={13} strokeWidth={2.5} />
          Terminate Session
        </button>
      </div>
    </div>
  );
}