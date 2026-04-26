import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X, Sparkles } from 'lucide-react';
import type { ToastProps } from '../../hooks/useToast';
import { slideInRight, springSnappy } from '../../lib/animations';

const iconMap = {
  success: <CheckCircle2 size={20} className="text-hsl(var(--success))" />,
  error: <XCircle size={20} className="text-hsl(var(--danger))" />,
  warning: <AlertTriangle size={20} className="text-hsl(var(--warning))" />,
  info: <Info size={20} className="text-hsl(var(--info))" />,
  celebration: <Sparkles size={20} className="text-brand-500" />,
};

const bgMap = {
  success: 'bg-hsl(var(--success))',
  error: 'bg-hsl(var(--danger))',
  warning: 'bg-hsl(var(--warning))',
  info: 'bg-hsl(var(--info))',
  celebration: 'bg-brand-500',
};

export const Toast: React.FC<ToastProps & { onDismiss: (id: string) => void }> = ({
  id,
  type,
  title,
  description,
  action,
  duration = 4000,
  onDismiss,
}) => {
  return (
    <motion.div
      layout
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit={{ x: '100%', opacity: 0, transition: springSnappy }}
      className="relative glass-medium elevation-4 rounded-[var(--radius-lg)] px-4 py-3.5 flex items-start gap-3 min-w-[320px] max-w-[420px] overflow-hidden pointer-events-auto"
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex-shrink-0 mt-0.5">
        {iconMap[type]}
      </div>
      
      <div className="flex-1 min-w-0 pr-4">
        <h4 className="text-sm font-semibold text-hsl(var(--text-primary)) leading-tight">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-hsl(var(--text-secondary)) mt-0.5 leading-snug">
            {description}
          </p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs font-medium text-hsl(var(--brand-500)) hover:underline mt-2 focus-ring rounded-sm"
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onDismiss(id)}
        className="absolute top-3 right-3 text-hsl(var(--text-tertiary)) hover:text-hsl(var(--text-primary)) focus-ring rounded-sm"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>

      {/* Progress Bar */}
      {duration !== Infinity && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-0.5 ${bgMap[type]} opacity-40`}
        />
      )}
    </motion.div>
  );
};
