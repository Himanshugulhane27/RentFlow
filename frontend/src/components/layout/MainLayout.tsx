import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppSelector } from '../../store/hooks';

export const MainLayout: React.FC = () => {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar />

      <motion.div
        initial={false}
        animate={{ marginLeft: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex flex-col min-h-screen"
      >
        <Header />

        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};
