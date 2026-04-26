import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandBar } from '../CommandBar';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50/50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="ml-60 mt-14 p-8 flex-1">
          <Outlet />
        </main>
      </div>
      <CommandBar />
    </div>
  );
};
