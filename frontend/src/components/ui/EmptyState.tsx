import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../../lib/animations';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex flex-col items-center justify-center py-16 text-center ${className || ''}`}
    >
      <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[hsl(var(--text-tertiary))] mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))] mb-1">{title}</h3>
      <p className="text-sm text-[hsl(var(--text-secondary))] max-w-sm mb-6">{description}</p>
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
