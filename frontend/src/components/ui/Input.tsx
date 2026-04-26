import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
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
        <motion.div 
          className="relative"
          animate={error ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
          transition={error ? { duration: 0.4 } : undefined}
        >
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-hsl(var(--text-tertiary))">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-hsl(var(--surface-0)) border rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm shadow-[var(--shadow-xs)] text-hsl(var(--text-primary)) placeholder:text-hsl(var(--text-tertiary))',
              'transition-all duration-150',
              'focus-ring',
              'disabled:bg-hsl(var(--surface-3)) disabled:text-hsl(var(--text-disabled)) disabled:cursor-not-allowed',
              error
                ? 'border-hsl(var(--danger)) focus:ring-hsl(var(--danger)/0.2)'
                : 'border-hsl(var(--surface-border))',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </motion.div>
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
