import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '../../hooks/useToast';
import { Toast } from './Toast';

export const Toaster: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-auto sm:right-6 z-[100] flex flex-col gap-3 px-4 pb-4 sm:p-0 items-stretch sm:items-end pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence mode="sync">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};
