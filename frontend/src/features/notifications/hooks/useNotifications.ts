import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../../api/dashboard.api';
import { useOptimisticUpdate } from '../../../hooks/useOptimisticUpdate';
import { formatCurrency } from '../../../utils/format';

export interface Notification {
  id: string;
  type: 'overdue' | 'lease_expired' | 'due_soon' | 'lease_expiring' | 'payment_received' | 'tenant_added' | 'document_uploaded';
  title: string;
  description: string;
  entityId: string;
  entityType: 'payment' | 'lease' | 'tenant' | 'property';
  route: string;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  const { data: alertsData, isLoading } = useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: dashboardApi.getAlerts,
  });

  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const { mutateOptimistically } = useOptimisticUpdate(['notifications'], (old: any) => old);

  // TODO: Replace with GET /api/notifications when backend endpoint is built
  const notifications = useMemo(() => {
    const list: Notification[] = [];

    if (alertsData) {
      alertsData.overduePayments.forEach(payment => {
        const tenantName = typeof payment.tenantId === 'object' 
          ? (payment.tenantId as any).firstName + ' ' + (payment.tenantId as any).lastName
          : 'Tenant';
        list.push({
          id: `notif-pay-${payment._id}`,
          type: 'overdue',
          title: 'Payment Overdue',
          description: `${tenantName} has an overdue payment of ${formatCurrency(payment.totalAmount)}.`,
          entityId: payment._id,
          entityType: 'payment',
          route: `/payments?status=overdue`,
          read: readIds.has(`notif-pay-${payment._id}`),
          createdAt: new Date().toISOString(), // In reality, from backend
        });
      });

      alertsData.expiringLeases.forEach(lease => {
        const unitName = typeof lease.propertyId === 'object' 
          ? (lease.propertyId as any).address 
          : 'A unit';
        list.push({
          id: `notif-lease-${lease._id}`,
          type: 'lease_expiring',
          title: 'Lease Expiring Soon',
          description: `The lease for ${unitName} is expiring on ${new Date(lease.endDate).toLocaleDateString()}.`,
          entityId: lease._id,
          entityType: 'lease',
          route: `/leases/${lease._id}`,
          read: readIds.has(`notif-lease-${lease._id}`),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        });
      });
    }

    // Hardcode some informational ones
    list.push({
      id: 'notif-mock-1',
      type: 'payment_received',
      title: 'Payment Received',
      description: `${formatCurrency(15000)} received from Sarah Jenkins.`,
      entityId: 'mock-1',
      entityType: 'payment',
      route: '/payments',
      read: readIds.has('notif-mock-1'),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    });

    list.push({
      id: 'notif-mock-2',
      type: 'tenant_added',
      title: 'New Tenant Onboarded',
      description: 'Michael Scott has completed the onboarding flow.',
      entityId: 'mock-2',
      entityType: 'tenant',
      route: '/tenants',
      read: readIds.has('notif-mock-2'),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    });

    return list
      .filter(n => !dismissedIds.has(n.id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [alertsData, readIds, dismissedIds]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    // TODO: Call PATCH /api/notifications/:id/read
    setReadIds(prev => new Set(prev).add(id));
  };

  const markAllAsRead = () => {
    // TODO: Call PATCH /api/notifications/read-all
    setReadIds(new Set(notifications.map(n => n.id)));
  };

  const dismissNotification = (id: string) => {
    mutateOptimistically(async () => {
      // Mock API call to delete notification
      await new Promise(resolve => setTimeout(resolve, 300));
    }).then(() => {
      setDismissedIds(prev => new Set(prev).add(id));
    }).catch(() => {
      console.error('Failed to dismiss notification');
    });
    // Optimistically hide it
    setDismissedIds(prev => new Set(prev).add(id));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    isLoading,
  };
}
