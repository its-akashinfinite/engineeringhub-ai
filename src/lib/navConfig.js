import React from 'react';
import { LayoutDashboard, BookOpen, Code2, Settings, AudioLines, Trophy } from 'lucide-react';

// Pure JavaScript representation of the SVG so Vite doesn't complain about JSX in a .js file
const GithubIcon = (props) => {
  return React.createElement(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      stroke: 'currentColor',
      fill: 'none',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...props,
    },
    React.createElement('path', {
      d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
    }),
    React.createElement('path', {
      d: 'M9 18c-4.51 2-5-2-7-2',
    })
  );
};

export const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Courses', path: '/courses', icon: BookOpen },
  { label: 'Projects', path: '/projects', icon: Code2 },
  { label: 'DSP Workspace', path: '/dsp-workspace', icon: AudioLines },
  { label: 'LeetCode Tracker', path: '/leetcode', icon: Trophy },
  { label: 'GitHub Projects', path: '/github', icon: GithubIcon },
  { label: 'Settings', path: '/settings', icon: Settings },
];