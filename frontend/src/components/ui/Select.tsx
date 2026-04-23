import React from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-surface-900',
            'transition-colors duration-150 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
            'dark:bg-surface-800 dark:text-surface-100 dark:border-surface-600',
            error
              ? 'border-danger-500 focus:ring-danger-500/40'
              : 'border-surface-300',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-danger-600 dark:text-danger-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
