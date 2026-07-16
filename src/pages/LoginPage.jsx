import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    login(); // Flips auth state to true
    navigate('/', { replace: true }); // Sends you to the dashboard
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-6 border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex justify-center">
          <span className="border border-black rounded-lg px-3 py-1 font-bold text-sm">EH</span>
        </div>
        <h2 className="text-center text-zinc-600 text-sm font-medium">Sign in to continue to EngineerHub</h2>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <input type="email" placeholder="you@university.edu" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" required />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" required />
          </div>
          
          <div className="text-center text-xs text-gray-400 my-2">or</div>
          
          <button type="submit" className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors">
            Continue with Google
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-500">
          Don't have an account? <span className="font-medium cursor-pointer text-gray-800">Sign up</span>
        </p>
      </div>
    </div>
  );
}