import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonLoaderProps {
  lines?: number;
  width?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  lines = 1,
  width,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)} style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-neutral-100 rounded h-4',
            i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  );
};
