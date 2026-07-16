import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex selection:bg-white selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Workspace Area */}
      <div className="flex-1 flex flex-col min-h-screen border-l border-zinc-900">
        <Header />
        <main className="flex-1 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}