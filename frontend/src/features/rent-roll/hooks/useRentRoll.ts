import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';

import { differenceInDays } from '../../../utils/format';
import type { RentRollFilters } from '../../../components/rent-roll/FilterPanel';

export interface RentRollRow {
  id: string;
  unit: string;
  propertyId: string;
  propertyName: string;
  tenantId: string | null;
  tenantName: string | null;
  tenantInitial: string | null;
  monthlyRent: number | null;
  status: 'paid' | 'overdue' | 'pending' | 'vacant';
  dueDate: string | null;
  leaseEndsAt: string | null;
  daysUntilLeaseEnd: number | null;
  lastPaymentDate: string | null;
  lastPaymentAmount: number | null;
  healthScore: 'reliable' | 'watch' | 'at-risk' | null;
  paymentId: string | null;
  leaseId: string | null;
}

export interface UseRentRollReturn {
  data: RentRollRow[];
  filteredData: RentRollRow[];
  isLoading: boolean;
  filters: RentRollFilters;
  setFilters: React.Dispatch<React.SetStateAction<RentRollFilters>>;
  resetFilters: () => void;
  activeFilterCount: number;
  properties: { id: string; name: string }[];
}

export function useRentRoll(): UseRentRollReturn {
  const defaultFilters: RentRollFilters = {
    search: '',
    status: [],
    rentMin: null,
    rentMax: null,
    leaseEndBefore: null,
    leaseEndAfter: null,
    healthScoreMin: null,
  };
  const [filters, setFilters] = useState<RentRollFilters>(defaultFilters);

  const resetFilters = () => setFilters(defaultFilters);

  const activeFilterCount = 
    (filters.search ? 1 : 0) + 
    filters.status.length + 
    (filters.rentMin !== null ? 1 : 0) + 
    (filters.rentMax !== null ? 1 : 0) + 
    (filters.leaseEndBefore ? 1 : 0) + 
    (filters.leaseEndAfter ? 1 : 0) + 
    (filters.healthScoreMin !== null ? 1 : 0);

  const { data: raw = [], isLoading } = useQuery({
    queryKey: ['payments', 'all'],
    queryFn: () => apiClient.get('/payments?status=all').then(r => r.data.data),
    staleTime: 30_000,
  });

  const data = useMemo<RentRollRow[]>(() => {
    return raw.map((p: any) => {
      const tenant = p.tenantId ?? p.tenant ?? null;
      const lease  = p.leaseId  ?? p.lease  ?? null;
      const prop   = p.propertyId ?? p.property ?? null;

      const fullName = tenant
        ? `${tenant.firstName ?? ''} ${tenant.lastName ?? ''}`.trim()
        : null;

      const daysLeft = lease?.endDate
        ? differenceInDays(new Date(lease.endDate), new Date())
        : null;

      return {
        id:               p._id,
        unit:             lease?.unitNumber ?? prop?.unit ?? prop?.address?.split(',')[0] ?? 'Unit',
        propertyId:       prop?._id ?? null,
        propertyName:     prop?.name ?? prop?.address ?? 'Unknown Property',
        tenantId:         tenant?._id ?? (typeof tenant === 'string' ? tenant : null),
        tenantName:       fullName || null,
        tenantInitial:    tenant?.firstName?.[0]?.toUpperCase() ?? null,
        monthlyRent:      p.amount ?? p.totalAmount ?? null,
        status:           p.status,
        dueDate:          p.dueDate ?? null,
        leaseEndsAt:      lease?.endDate ?? null,
        daysUntilLeaseEnd: daysLeft,
        lastPaymentDate:  p.paidDate ?? null,
        lastPaymentAmount: p.totalAmount ?? null,
        healthScore:      null,
        paymentId:        p._id,
        leaseId:          lease?._id ?? (typeof lease === 'string' ? lease : null),
      };
    });
  }, [raw]);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      if (filters.status.length > 0 && !filters.status.includes(row.status as any)) return false;
      
      if (filters.rentMin !== null && (row.monthlyRent === null || row.monthlyRent < filters.rentMin)) return false;
      if (filters.rentMax !== null && (row.monthlyRent === null || row.monthlyRent > filters.rentMax)) return false;

      if (filters.leaseEndBefore && row.leaseEndsAt) {
        if (new Date(row.leaseEndsAt) > new Date(filters.leaseEndBefore)) return false;
      }
      if (filters.leaseEndAfter && row.leaseEndsAt) {
        if (new Date(row.leaseEndsAt) < new Date(filters.leaseEndAfter)) return false;
      }

      if (filters.healthScoreMin !== null) {
        const scoreMap: Record<string, number> = { 'reliable': 100, 'watch': 50, 'at-risk': 0 };
        const score = row.healthScore ? scoreMap[row.healthScore] : 0;
        if (score < filters.healthScoreMin) return false;
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesUnit = row.unit.toLowerCase().includes(q);
        const matchesTenant = row.tenantName?.toLowerCase().includes(q) || false;
        if (!matchesUnit && !matchesTenant) return false;
      }
      return true;
    });
  }, [data, filters]);

  const properties = useMemo(() => {
    const uniqueProps = new Map<string, string>();
    raw.forEach((p: any) => {
      const prop = p.propertyId ?? p.property;
      if (prop?._id) {
        uniqueProps.set(prop._id, prop.address ?? prop.name ?? 'Unknown Property');
      }
    });
    return Array.from(uniqueProps.entries()).map(([id, name]) => ({ id, name }));
  }, [raw]);

  return {
    data,
    filteredData,
    isLoading,
    filters,
    setFilters,
    resetFilters,
    activeFilterCount,
    properties,
  };
}
