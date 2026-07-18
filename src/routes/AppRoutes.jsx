import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import Roadmaps from '../pages/Roadmaps';
import Projects from '../pages/Projects';
import AudioProcessor from '../pages/AudioProcessor';
import LeetCodeTracker from '../pages/LeetCodeTracker';
import GitHubTracker from '../pages/GitHubTracker'; // <-- Double check this file exists exactly as named in src/pages/
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('engineerhub-auth');
  const isAuth = token === 'true' || true; 
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Roadmaps />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/dsp-workspace" element={<AudioProcessor />} />
        <Route path="/leetcode" element={<LeetCodeTracker />} />
        <Route path="/github" element={<GitHubTracker />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}