import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { useInsightMessage, type InsightTone } from '../../hooks/useInsightMessage';

const iconMap: Record<InsightTone, React.ElementType> = {
  urgent: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info
};

const toneStyles: Record<InsightTone, { border: string; icon: string; bg: string }> = {
  urgent: { border: 'border-l-danger-500', icon: 'text-danger-500', bg: 'bg-danger-50' },
  warning: { border: 'border-l-warning-500', icon: 'text-warning-500', bg: 'bg-warning-50' },
  success: { border: 'border-l-success-500', icon: 'text-success-500', bg: 'bg-success-50' },
  info: { border: 'border-l-brand-500', icon: 'text-brand-500', bg: 'bg-brand-50' }
};

export const SmartSummary: React.FC = () => {
  const { message, tone, isLoading } = useInsightMessage();
  const Icon = iconMap[tone];
  const styles = toneStyles[tone];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Card className={`overflow-hidden border-l-4 ${styles.border} transition-colors duration-300`}>
      <div className="p-4 flex items-start gap-4">
        <div className={`p-2 rounded-full ${styles.bg}`}>
          <Icon className={styles.icon} size={20} />
        </div>
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: prefersReduced ? 0 : 0.3 }}
              className={`text-sm md:text-base leading-relaxed ${isLoading ? 'text-neutral-400' : 'text-neutral-700'}`}
            >
              {message}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
};
