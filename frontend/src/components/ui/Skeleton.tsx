import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
}) => {
  return (
    <div
      className={cn(
        'skeleton animate-pulse',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      style={{ width, height }}
    />
  );
};

/**
 * Pre-built skeleton for a card layout.
 */
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-5 space-y-4"
        >
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-5 w-3/4" variant="text" />
          <Skeleton className="h-4 w-1/2" variant="text" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Pre-built skeleton for a stats/KPI row.
 */
export const KPISkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-5 space-y-3"
        >
          <Skeleton className="h-4 w-24" variant="text" />
          <Skeleton className="h-8 w-16" variant="text" />
          <Skeleton className="h-3 w-20" variant="text" />
        </div>
      ))}
    </div>
  );
};
