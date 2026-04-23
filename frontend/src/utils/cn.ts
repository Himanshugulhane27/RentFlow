import { type ClassValue, clsx } from 'clsx';

/**
 * Merge class names with Tailwind-aware conflict resolution.
 * Usage: cn('px-4 py-2', condition && 'bg-primary-500', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
