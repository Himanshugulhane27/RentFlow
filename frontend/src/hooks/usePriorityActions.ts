import { useActionItems } from '../features/dashboard/hooks/useDashboardStats';

export interface PriorityAction {
  id: string;
  label: string;
  description: string;
  href: string;
  urgency: 'high' | 'medium' | 'low';
}

export function usePriorityActions(): { actions: PriorityAction[]; isLoading: boolean } {
  const { data: alerts, isLoading } = useActionItems();

  if (isLoading || !alerts) {
    return { actions: [], isLoading: true };
  }

  // Map the existing alerts from useActionItems to PriorityAction format
  const actions: PriorityAction[] = alerts.slice(0, 3).map(alert => {
    let label = alert.title;
    let description = alert.description;

    // Enhance text if needed based on type
    if (alert.type === 'overdue') {
      label = `Collect overdue rent`;
      description = `${alert.title} — ${alert.description}`;
    } else if (alert.type === 'expiring') {
      label = `Renew lease`;
      description = `${alert.title} — ${alert.description}`;
    } else if (alert.type === 'vacant') {
      label = `Fill vacant unit`;
      description = `${alert.title} — ${alert.description}`;
    }

    return {
      id: alert.id,
      label,
      description,
      href: alert.actionRoute,
      urgency: alert.priority as 'high' | 'medium' | 'low',
    };
  });

  return { actions, isLoading };
}
