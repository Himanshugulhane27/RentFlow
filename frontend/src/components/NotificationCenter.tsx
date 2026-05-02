import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell, AlertCircle, Clock, CheckCircle2, UserPlus, FileText, IndianRupee
} from 'lucide-react';
import { useNotifications } from '../features/notifications/hooks/useNotifications';
import type { Notification } from '../features/notifications/hooks/useNotifications';
import { formatRelativeTime } from '../utils/format';
import { SkeletonList } from './ui/Skeleton';
import { EmptyState } from './ui/EmptyState';
import { staggerContainer, staggerItem, springSnappy } from '../lib/animations';
import { cn } from '../utils/cn';

const iconBgByType: Record<string, string> = {
  overdue: 'bg-danger-100 text-danger-600',
  lease_expired: 'bg-danger-100 text-danger-600',
  due_soon: 'bg-warning-100 text-warning-600',
  lease_expiring: 'bg-warning-100 text-warning-600',
  payment_received: 'bg-success-100 text-success-600',
  tenant_added: 'bg-brand-100 text-brand-600',
  document_uploaded: 'bg-purple-100 text-purple-600',
};

const NotificationIcon = ({ type, size }: { type: string, size: number }) => {
  switch (type) {
    case 'overdue':
    case 'lease_expired':
      return <AlertCircle size={size} />;
    case 'due_soon':
    case 'lease_expiring':
      return <Clock size={size} />;
    case 'payment_received':
      return <IndianRupee size={size} />;
    case 'tenant_added':
      return <UserPlus size={size} />;
    case 'document_uploaded':
      return <FileText size={size} />;
    default:
      return <Bell size={size} />;
  }
};

export const NotificationCenter: React.FC = () => {
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification, isLoading } = useNotifications();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const urgentItems = notifications.filter(n => ['overdue', 'lease_expired'].includes(n.type));
  const upcomingItems = notifications.filter(n => ['due_soon', 'lease_expiring'].includes(n.type));
  const recentItems = notifications.filter(n => !['overdue', 'lease_expired', 'due_soon', 'lease_expiring'].includes(n.type));

  const NotificationItem = ({ n }: { n: Notification }) => (
    <motion.div
      variants={prefersReduced ? undefined : staggerItem}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: "100%", transition: springSnappy }}
      whileHover={prefersReduced ? undefined : { x: 2 }}
      onClick={() => {
        markAsRead(n.id);
        navigate(n.route);
        setOpen(false);
      }}
      className={cn(
        "relative group flex items-start gap-3 px-4 py-3 cursor-pointer transition-all border-l-2 hover:bg-[var(--color-surface)]",
        !n.read ? "border-brand-500 bg-brand-50/50" : "border-transparent bg-transparent"
      )}
      style={{ transitionDuration: 'var(--transition-fast)' }}
    >
      <div className={cn("w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0 mt-0.5", iconBgByType[n.type] || 'bg-[var(--color-surface)] text-[hsl(var(--text-secondary))]')}>
        <NotificationIcon type={n.type} size={16}/>
      </div>
      
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-[hsl(var(--text-primary))] leading-snug">{n.title}</p>
        <p className="text-xs text-[hsl(var(--text-secondary))] mt-0.5 truncate">{n.description}</p>
        <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">{formatRelativeTime(n.createdAt)}</p>
      </div>

      <div className="flex flex-col items-center gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            dismissNotification(n.id);
          }}
          className="p-1 rounded text-[hsl(var(--text-tertiary))] hover:text-[hsl(var(--text-primary))] hover:bg-[var(--color-surface)] focus-ring"
          title="Dismiss"
        >
          &times;
        </button>
        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />}
      </div>
      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 mt-2 group-hover:hidden" />}
    </motion.div>
  );

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-[hsl(var(--text-secondary))] hover:bg-[var(--color-surface)] transition-colors focus-ring"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={prefersReduced ? false : { scale: 0 }}
            animate={prefersReduced ? {} : { scale: 1 }}
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 border border-[var(--color-surface-raised)] rounded-full"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={prefersReduced ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-0 inset-x-0 rounded-t-2xl sm:absolute sm:top-full sm:bottom-auto sm:inset-x-auto sm:right-0 sm:mt-2 w-full sm:w-96 max-h-[80vh] sm:max-h-[480px] overflow-hidden glass-medium shadow-[var(--shadow-lg)] border border-[var(--color-border)] sm:rounded-[var(--radius-xl)] z-[var(--z-overlay)] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)] bg-transparent sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[hsl(var(--text-primary))]">Notifications</p>
                {unreadCount > 0 && (
                  <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-[var(--radius-full)]">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                  className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors focus-ring rounded-sm"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4">
                  <SkeletonList rows={4} />
                </div>
              ) : notifications.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 size={32} className="text-success-500" />}
                  title="You're all caught up!"
                  description="No new notifications at this time."
                  className="py-12"
                />
              ) : (
                <motion.div 
                  variants={staggerContainer}
                  initial={prefersReduced ? false : "initial"}
                  animate={prefersReduced ? {} : "animate"}
                  className="pb-safe"
                >
                  <AnimatePresence>
                    {urgentItems.length > 0 && (
                    <div className="py-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--text-tertiary))] px-4 py-2">Urgent</p>
                      {urgentItems.map(n => <NotificationItem key={n.id} n={n} />)}
                    </div>
                  )}
                  {upcomingItems.length > 0 && (
                    <div className="py-2 border-t border-[var(--color-border-subtle)]">
                      <p className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--text-tertiary))] px-4 py-2">Upcoming</p>
                      {upcomingItems.map(n => <NotificationItem key={n.id} n={n} />)}
                    </div>
                  )}
                  {recentItems.length > 0 && (
                    <div className="py-2 border-t border-[var(--color-border-subtle)]">
                      <p className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--text-tertiary))] px-4 py-2">Recent</p>
                      {recentItems.map(n => <NotificationItem key={n.id} n={n} />)}
                    </div>
                  )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
