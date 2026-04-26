import React from 'react';
import { motion } from 'framer-motion';
import { Clock, IndianRupee, FileText, Bell, User, Info } from 'lucide-react';
import type { TimelineEvent } from '../features/timeline/hooks/useActivityTimeline';
import { formatRelativeTime, formatCurrency } from '../utils/format';
import { SkeletonTimelineItem } from './ui/Skeleton';
import { staggerContainer, staggerItem } from '../lib/animations';
import { EmptyState } from './ui/EmptyState';

interface ActivityTimelineProps {
  events: TimelineEvent[];
  isLoading?: boolean;
}

const dotColorByType: Record<string, string> = {
  payment: 'bg-success-100 text-success-600',
  lease: 'bg-brand-100 text-brand-600',
  document: 'bg-purple-100 text-purple-600',
  reminder: 'bg-warning-100 text-warning-600',
  tenant: 'bg-neutral-100 text-neutral-500',
  general: 'bg-neutral-100 text-neutral-400',
};

const EventIcon = ({ type, size }: { type: string, size: number }) => {
  switch (type) {
    case 'payment': return <IndianRupee size={size} />;
    case 'lease': return <FileText size={size} />;
    case 'document': return <FileText size={size} />;
    case 'reminder': return <Bell size={size} />;
    case 'tenant': return <User size={size} />;
    default: return <Info size={size} />;
  }
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6 relative py-2">
        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-neutral-100" />
        {[1, 2, 3, 4].map(i => (
          <SkeletonTimelineItem key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Clock size={24} className="text-neutral-400" />}
        title="No activity yet"
        description="This timeline will populate as events occur."
        className="py-8"
      />
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3.5 top-3 bottom-3 w-px bg-neutral-100" />
      
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-0"
      >
        {events.map((event) => (
          <motion.div
            key={event.id}
            variants={staggerItem}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            {/* Dot */}
            <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white ${dotColorByType[event.type] || dotColorByType.general}`}>
              <EventIcon type={event.type} size={13} />
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-neutral-800 leading-snug">
                  {event.title}
                </p>
                <span className="text-xs text-neutral-400 flex-shrink-0 mt-0.5">
                  {formatRelativeTime(event.createdAt)}
                </span>
              </div>
              {event.description && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  {event.description}
                </p>
              )}
              {event.amount && (
                <p className="text-xs font-semibold text-success-600 mt-1">
                  {formatCurrency(event.amount)}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
