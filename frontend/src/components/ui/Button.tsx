import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { springSnappy } from '../../lib/animations';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 border border-transparent shadow-sm',
  secondary: 'bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[hsl(var(--text-primary))] hover:bg-[var(--color-surface)] hover:border-brand-300',
  ghost: 'bg-transparent text-[hsl(var(--text-secondary))] hover:bg-[var(--color-surface)] hover:text-[hsl(var(--text-primary))] border border-transparent',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileTap={disabled || loading ? undefined : { scale: 0.96 }}
      whileHover={disabled || loading || variant !== 'primary' ? undefined : { scale: 1.02 }}
      transition={springSnappy}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-input transition-all duration-150',
        'focus-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon && <span className={cn(children ? 'mr-1' : '')}>{icon}</span>}
      {children}
    </motion.button>
  );
};
