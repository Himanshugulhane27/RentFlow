import React from 'react';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/formatters';
import { FadeImage } from './FadeImage';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
};

const bgColors = [
  'bg-primary-500', 'bg-secondary-500', 'bg-success-500',
  'bg-warning-500', 'bg-danger-500', 'bg-blue-500',
  'bg-pink-500', 'bg-teal-500',
];

const getColor = (name: string): string => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return bgColors[hash % bgColors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className,
}) => {
  if (src) {
    return (
      <FadeImage
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover ring-2 ring-white dark:ring-surface-800',
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-surface-800',
        sizeStyles[size],
        getColor(name),
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};
