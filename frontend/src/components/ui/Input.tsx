import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
              'dark:bg-surface-800 dark:text-surface-100 dark:border-surface-600 dark:placeholder:text-surface-500',
              'dark:focus:ring-primary-400/40 dark:focus:border-primary-400',
              error
                ? 'border-danger-500 focus:ring-danger-500/40 focus:border-danger-500'
                : 'border-surface-300',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-danger-600 dark:text-danger-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-surface-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
