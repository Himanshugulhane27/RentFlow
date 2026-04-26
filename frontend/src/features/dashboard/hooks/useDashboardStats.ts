import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../../api/dashboard.api';
import { differenceInDays, formatCurrency } from '../../../utils/format';

export function useDashboardStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  });

  const { data: trendData } = useQuery({
    queryKey: ['dashboard', 'revenue-trend'],
    queryFn: () => dashboardApi.getRevenueTrend(6),
  });

  // Calculate trends from revenue trend data or use mocks for missing historical data
  const collectedLastMonth = trendData && trendData.length > 1 
    ? trendData[trendData.length - 2].revenue 
    : (data?.monthlyRevenue || 0) * 0.9;

  return {
    data: data ? {
      collectedThisMonth: data.monthlyRevenue,
      totalExpectedThisMonth: Math.max(data.monthlyRevenue, data.expectedNextRevenue) || 1, // prevent /0
      collectionPercent: Math.min(100, Math.round((data.monthlyRevenue / Math.max(1, data.expectedNextRevenue)) * 100)),
      overdueAmount: data.overdueAmount,
      overdueCount: data.overduePayments,
      occupancyRate: data.occupancyRate,
      occupiedUnits: data.occupiedProperties,
      totalUnits: data.totalProperties,
      totalTenants: data.totalTenants,
      expiringLeasesCount: data.expiringLeases,
      collectedLastMonth,
      overdueLastMonth: data.overdueAmount * 1.1, // mock
      occupancyLastMonth: data.occupancyRate - 2, // mock
    } : null,
    isLoading,
    isError
  };
}

export function useActionItems() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: dashboardApi.getAlerts,
  });

  if (!data) return { data: [], isLoading };

  const items: any[] = [];

  // Overdue payments (High priority)
  data.overduePayments.forEach(payment => {
    const tenantName = typeof payment.tenantId === 'object' 
      ? (payment.tenantId as any).fullName || `${(payment.tenantId as any).firstName} ${(payment.tenantId as any).lastName}`
      : 'Unknown Tenant';
      
    items.push({
      id: `payment-${payment._id}`,
      type: 'overdue',
      priority: 'high',
      title: `${tenantName} is overdue`,
      description: `Payment of ${formatCurrency(payment.totalAmount)} was due ${differenceInDays(new Date(), new Date(payment.dueDate))} days ago`,
      entityId: typeof payment.tenantId === 'object' ? (payment.tenantId as any)._id : payment.tenantId,
      entityType: 'tenant',
      actionLabel: 'Send Reminder',
      actionRoute: `/payments?status=overdue&tenant=${typeof payment.tenantId === 'object' ? (payment.tenantId as any)._id : payment.tenantId}`
    });
  });

  // Expiring leases (Medium priority)
  data.expiringLeases.forEach(lease => {
    const unitName = typeof lease.propertyId === 'object'
      ? (lease.propertyId as any).unit || (lease.propertyId as any).address
      : 'Unknown Unit';
      
    items.push({
      id: `lease-${lease._id}`,
      type: 'expiring',
      priority: 'medium',
      title: `Lease for ${unitName} expires soon`,
      description: `Expires in ${differenceInDays(new Date(lease.endDate), new Date())} days`,
      entityId: lease._id,
      entityType: 'lease',
      actionLabel: 'Review Lease',
      actionRoute: `/leases/${lease._id}`
    });
  });

  // TODO: Fetch Vacant properties from API to add to action items
  // Mocking one vacant property
  if (items.length < 6) {
    items.push({
      id: 'mock-vacant-1',
      type: 'vacant',
      priority: 'low',
      title: 'Unit 4B is vacant',
      description: 'Has been vacant for 12 days',
      entityId: 'mock-prop-1',
      entityType: 'property',
      actionLabel: 'View Unit',
      actionRoute: `/properties/mock-prop-1`
    });
  }

  // Sort: High > Medium > Low
  const priorityWeight = { high: 1, medium: 2, low: 3 };
  items.sort((a, b) => priorityWeight[a.priority as keyof typeof priorityWeight] - priorityWeight[b.priority as keyof typeof priorityWeight]);

  return { data: items.slice(0, 6), isLoading };
}

export function useRevenueHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'revenue-trend'],
    queryFn: () => dashboardApi.getRevenueTrend(6),
  });

  const formattedData = data?.map(point => ({
    month: point.month,
    collected: point.revenue,
  })) || [];

  return { data: formattedData, isLoading };
}

export function useRentRollPreview() {
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: dashboardApi.getAlerts,
  });

  // Since we don't have a direct rent-roll endpoint yet, we build a preview from alerts and mock some data
  // TODO: Replace with GET /api/rent-roll
  
  const loading = alertsLoading;
  const rows: any[] = [];

  if (alertsData) {
    alertsData.overduePayments.forEach(payment => {
      const tenant = typeof payment.tenantId === 'object' ? payment.tenantId as any : null;
      const property = typeof payment.propertyId === 'object' ? payment.propertyId as any : null;
      
      rows.push({
        id: `rr-pay-${payment._id}`,
        unit: property?.unit || property?.address?.split(',')[0] || 'Unit',
        propertyName: property?.address || 'Unknown Property',
        tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown Tenant',
        monthlyRent: payment.amount,
        dueDate: payment.dueDate,
        status: 'overdue',
        leaseEndsAt: null, // Don't have it directly here
      });
    });

    alertsData.expiringLeases.forEach(lease => {
      // Avoid duplicates
      if (rows.some(r => r.tenantName === (typeof lease.tenantId === 'object' ? `${(lease.tenantId as any).firstName} ${(lease.tenantId as any).lastName}` : lease.tenantId))) return;

      const tenant = typeof lease.tenantId === 'object' ? lease.tenantId as any : null;
      const property = typeof lease.propertyId === 'object' ? lease.propertyId as any : null;

      rows.push({
        id: `rr-lease-${lease._id}`,
        unit: property?.unit || property?.address?.split(',')[0] || 'Unit',
        propertyName: property?.address || 'Unknown Property',
        tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown Tenant',
        monthlyRent: lease.monthlyRent,
        dueDate: new Date().toISOString(), // Mocking current period
        status: 'paid',
        leaseEndsAt: lease.endDate,
      });
    });
  }

  // Add some generic mock rows to fill up to 5
  if (!loading && rows.length < 5) {
    rows.push({
      id: 'mock-rr-1',
      unit: 'Apt 101',
      propertyName: 'Sunset Valley',
      tenantName: null,
      monthlyRent: 15000,
      dueDate: null,
      status: 'vacant',
      leaseEndsAt: null,
    });
    rows.push({
      id: 'mock-rr-2',
      unit: 'Apt 204',
      propertyName: 'Ocean View',
      tenantName: 'Sarah Jenkins',
      monthlyRent: 22000,
      dueDate: new Date().toISOString(),
      status: 'pending',
      leaseEndsAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  // Sort overdue -> expiring soon -> vacant -> pending -> paid
  const statusWeight = { overdue: 1, pending: 2, vacant: 3, paid: 4 };
  rows.sort((a, b) => statusWeight[a.status as keyof typeof statusWeight] - statusWeight[b.status as keyof typeof statusWeight]);

  return { data: rows.slice(0, 5), isLoading: loading };
}
