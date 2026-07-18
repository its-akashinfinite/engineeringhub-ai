import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7] dark:bg-[#03000a] relative overflow-hidden px-4 transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30 dark:opacity-100 transition-opacity duration-300">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-black/5 to-black/[0.02] border border-zinc-300/50 shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)] dark:from-white/10 dark:to-white/[0.02] dark:border-white/20 dark:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center mb-4">
            <span className="text-zinc-800 dark:text-white font-bold text-sm">EH</span>
          </div>
          <h1 className="text-zinc-900 dark:text-white text-lg font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400/80 text-sm mt-1">
            Sign in to continue to EngineerHub
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-white/[0.03] dark:border-white/[0.08] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400/80 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  strokeWidth={1.75}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  className="w-full bg-black/[0.02] border border-black/[0.08] text-zinc-900 placeholder:text-zinc-400 focus:border-black/20 focus:ring-black/5 dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white/30 dark:focus:ring-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400/80">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-zinc-500 dark:text-zinc-400/70 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  strokeWidth={1.75}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black/[0.02] border border-black/[0.08] text-zinc-900 placeholder:text-zinc-400 focus:border-black/20 focus:ring-black/5 dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white/30 dark:focus:ring-white/5 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-black/5 to-black/[0.02] hover:from-black/10 hover:to-black/5 text-zinc-800 border border-zinc-300/50 shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)] hover:border-zinc-400/50 dark:from-white/10 dark:to-white/[0.02] dark:hover:from-white/15 dark:hover:to-white/5 dark:text-white dark:border-white/20 dark:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] dark:hover:border-white/30 text-sm font-medium rounded-xl py-2.5 transition-all duration-300 mt-2"
            >
              Sign in
              <ArrowRight size={15} strokeWidth={2} />
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-black/[0.08] dark:bg-white/[0.08]" />
            <span className="text-xs text-zinc-400 dark:text-zinc-500">or</span>
            <div className="flex-1 h-px bg-black/[0.08] dark:bg-white/[0.08]" />
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-black/[0.02] border border-black/[0.08] hover:border-zinc-400/50 text-zinc-700 dark:bg-white/[0.03] dark:border-white/[0.1] dark:hover:border-white/30 dark:text-zinc-300 text-sm font-medium rounded-xl py-2.5 transition-all duration-300"
          >
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400/80 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}