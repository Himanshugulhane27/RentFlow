import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  interactive = false,
  onClick,
  padding = 'md',
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-surface-200 shadow-xs',
        'dark:bg-surface-800 dark:border-surface-700',
        paddingStyles[padding],
        interactive && 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card active:translate-y-0',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h3 className={cn('text-base font-semibold text-surface-900 dark:text-surface-100', className)}>{children}</h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn(className)}>{children}</div>
);
