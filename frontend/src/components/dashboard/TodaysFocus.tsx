import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { usePriorityActions } from '../../hooks/usePriorityActions';
import { EmptyState } from '../ui/EmptyState';

const urgencyColor = {
  high: 'bg-danger-500',
  medium: 'bg-warning-500',
  low: 'bg-neutral-300'
};

export const TodaysFocus: React.FC = () => {
  const { actions, isLoading } = usePriorityActions();
  const navigate = useNavigate();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: prefersReduced ? 0 : 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.3 } }
  };

  return (
    <Card className="flex flex-col p-0 overflow-hidden">
      <div className="flex items-center gap-2 p-5 border-b border-neutral-100 bg-neutral-50/50">
        <Clock size={18} className="text-neutral-500" />
        <h3 className="text-sm font-semibold text-neutral-900">Today's Focus</h3>
      </div>
      
      <div className="flex-1 p-2">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <div className="h-12 bg-neutral-100 animate-pulse rounded" />
            <div className="h-12 bg-neutral-100 animate-pulse rounded" />
          </div>
        ) : actions.length === 0 ? (
          <div className="py-6">
            <EmptyState 
              icon={<CheckCircle2 size={32} className="text-success-500" />}
              title="You're all caught up"
              description="No urgent items need your attention right now."
            />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-1"
          >
            {actions.map((action) => (
              <motion.div 
                key={action.id}
                variants={itemVariants}
                onClick={() => navigate(action.href)}
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${urgencyColor[action.urgency]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{action.label}</p>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">{action.description}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Card>
  );
};
