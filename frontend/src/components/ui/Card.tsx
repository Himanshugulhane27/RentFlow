import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { springStandard } from '../../lib/animations';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  interactive?: boolean; // alias for hoverable
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  interactive = false,
  onClick,
  ...props
}) => {
  const isHoverable = hoverable || interactive || !!onClick;
  
  return (
    <motion.div
      onClick={onClick}
      whileHover={isHoverable ? { y: -1, boxShadow: "var(--shadow-md)" } : undefined}
      transition={springStandard}
      className={cn(
        'bg-[var(--color-surface-raised)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6',
        isHoverable && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h3 className={cn('text-sm font-semibold text-[hsl(var(--text-primary))]', className)}>{children}</h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn(className)}>{children}</div>
);
