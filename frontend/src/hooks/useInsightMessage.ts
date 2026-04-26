import { useDashboardStats } from '../features/dashboard/hooks/useDashboardStats';
import { formatCurrency } from '../utils/format';

export type InsightTone = 'urgent' | 'warning' | 'success' | 'info';

export function useInsightMessage(): { message: string; tone: InsightTone; isLoading: boolean } {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading || !stats) {
    return { message: 'Analyzing portfolio data...', tone: 'info', isLoading: true };
  }

  // 1. Urgent: Overdue payments
  if (stats.overdueCount > 0) {
    return {
      message: `${stats.overdueCount} tenants are overdue totaling ${formatCurrency(stats.overdueAmount)}. Immediate action required.`,
      tone: 'urgent',
      isLoading: false
    };
  }

  // 2. Warning: Leases expiring
  if (stats.expiringLeasesCount > 0) {
    return {
      message: `${stats.expiringLeasesCount} leases expire within the next 30 days. Consider sending renewal notices.`,
      tone: 'warning',
      isLoading: false
    };
  }

  // 3. Success: 100% Occupied
  if (stats.occupancyRate === 100) {
    return {
      message: 'Excellent work! Your portfolio is 100% occupied and all rent is collected.',
      tone: 'success',
      isLoading: false
    };
  }

  // 4. Default Info
  return {
    message: `Your portfolio is operating smoothly at ${stats.occupancyRate}% occupancy.`,
    tone: 'info',
    isLoading: false
  };
}
