import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';

export interface TimelineEvent {
  id: string;
  type: 'payment' | 'lease' | 'document' | 'reminder' | 'tenant' | 'general';
  title: string;
  description?: string;
  amount?: number;
  createdAt: string;
}

export function useActivityTimeline(
  entityType: 'tenant' | 'lease' | 'property' | 'payment',
  entityId: string | null | undefined
) {
  const { data: raw = [], isLoading } = useQuery({
    queryKey: ['timeline', entityType, entityId],
    queryFn: () =>
      apiClient
        .get(`/timeline/${entityType}/${entityId}`)
        .then(r => r.data.data),
    enabled: !!entityId,
    staleTime: 30_000,
  });

  const events: TimelineEvent[] = raw.map((e: any) => ({
    ...e,
    id: e.id,
  }));

  return { events, isLoading };
}
