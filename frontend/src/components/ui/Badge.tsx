import React from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400',
  danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-400',
  info: 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400',
  neutral: 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-primary-500',
  neutral: 'bg-surface-400',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className,
  dot = false,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};
