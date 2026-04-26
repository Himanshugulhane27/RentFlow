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
      whileHover={isHoverable ? { y: -3, boxShadow: "var(--shadow-lg)" } : undefined}
      transition={springStandard}
      className={cn(
        'bg-white rounded-[var(--radius-xl)] elevation-2 card-border p-6',
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
  <h3 className={cn('text-lg font-semibold text-neutral-900', className)}>{children}</h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn(className)}>{children}</div>
);
