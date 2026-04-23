import React from 'react';
import { cn } from '../../utils/cn';
import { STATUS_COLORS } from '../../utils/constants';
import { Badge } from '../../components/ui/Badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  expired: 'Expired',
  terminated: 'Terminated',
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
  partial: 'Partial',
  cancelled: 'Cancelled',
  available: 'Available',
  occupied: 'Occupied',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const variant = (STATUS_COLORS[status] || 'neutral') as 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  const label = statusLabels[status] || status;

  return (
    <Badge variant={variant} dot className={cn(className)}>
      {label}
    </Badge>
  );
};
