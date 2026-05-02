import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../../api/payments.api';
import { Download, Grid3x3, UserPlus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { PageTransition } from '../../components/ui/PageTransition';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';
import { TenantDrawer } from '../../components/tenant/TenantDrawer';
import { TenantFormModal } from '../../components/tenant/TenantFormModal';
import { FilterPanel } from '../../components/rent-roll/FilterPanel';
import { useRentRoll } from './hooks/useRentRoll';
import { formatCurrency, formatDate } from '../../utils/format';
import { ConfettiBurst } from '../../components/ui/ConfettiBurst';
import { ContextTooltip } from '../../components/ui/ContextTooltip';
import { useFirstVisit } from '../../hooks/useFirstVisit';
import { toast } from '../../hooks/useToast';
import { useStreakCounter } from '../../hooks/useStreakCounter';

const RentRollPage: React.FC = () => {
  const {
    filteredData,
    isLoading,
    filters,
    setFilters,
    resetFilters,
  } = useRentRoll();
  
  const queryClient = useQueryClient();

  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formTenantId, setFormTenantId] = useState<string | undefined>(undefined);

  const [searchParams, setSearchParams] = useSearchParams();
  const highlightRowId = searchParams.get('highlight') || undefined;
  
  const { isFirstVisit, dismiss: dismissFirstVisit } = useFirstVisit('rent_roll_tip');
  const { incrementStreak } = useStreakCounter();
  const [confettiAnchor, setConfettiAnchor] = useState<React.RefObject<HTMLElement> | null>(null);
  const tooltipAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightRowId && !isLoading) {
      const el = document.getElementById(`row-${highlightRowId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const timer = setTimeout(() => {
          setSearchParams({}, { replace: true });
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [highlightRowId, isLoading, setSearchParams]);

  const { mutate: markPaid } = useMutation({
    mutationFn: async (row: any) => {
      if (row.paymentId) {
        return paymentApi.markPaid(row.paymentId, { paymentMethod: 'bank_transfer', notes: 'Collected via Rent Roll' });
      } else {
        // Create payment if none exists for the current period
        return paymentApi.create({
          leaseId: row.leaseId!,
          tenantId: row.tenantId!,
          propertyId: row.propertyId,
          amount: row.monthlyRent!,
          dueDate: new Date().toISOString(),
        }).then(p => paymentApi.markPaid(p._id, { paymentMethod: 'bank_transfer', notes: 'Collected via Rent Roll' }));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['leases'] });
      toast.celebration('Payment collected!');
      incrementStreak();
    },
    onError: (err) => {
      toast.error('Failed to record payment');
      console.error(err);
    }
  });

  const handleMarkAsPaid = (e: React.MouseEvent<HTMLElement>, row: any) => {
    e.stopPropagation();
    setConfettiAnchor({ current: e.currentTarget });
    markPaid(row);
  };

  const exportToCSV = () => {
    const headers = ['Unit', 'Property', 'Tenant', 'Rent', 'Status', 'Due Date', 'Lease Ends'];
    const rows = filteredData.map(r => [
      r.unit, 
      r.propertyName, 
      r.tenantName ?? 'Vacant',
      r.monthlyRent ?? 0, 
      r.status,
      r.dueDate ?? '', 
      r.leaseEndsAt ?? ''
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rent-roll-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ErrorBoundary>
      <PageTransition className="space-y-6 max-w-[1280px] mx-auto">
        {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--text-primary))]">Rent Roll</h1>
          <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">Live view of all units, tenants, and payment status</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" icon={<Download size={16} />} onClick={exportToCSV}>
            Export CSV
          </Button>
          <div ref={tooltipAnchorRef}>
            <Button 
              variant="primary" 
              size="sm" 
              icon={<UserPlus size={16} />} 
              onClick={() => {
                setFormMode('add');
                setFormTenantId(undefined);
                setFormModalOpen(true);
              }}
            >
              Add Tenant
            </Button>
          </div>
          <ContextTooltip
            isVisible={isFirstVisit}
            onDismiss={dismissFirstVisit}
            text="Track and collect rent payments for all your tenants here."
            anchorRef={tooltipAnchorRef}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          resultCount={filteredData.length}
        />

        <div className="flex-1 min-w-0 w-full">
          {/* Main Table */}
          <Card className="p-0 overflow-hidden">
        <DataTable
          loading={isLoading}
          data={filteredData}
          highlightRowId={highlightRowId}
          columns={[
            {
              key: 'unit',
              header: 'Unit',
              render: (row) => (
                <div>
                  <p className="text-sm font-semibold text-[hsl(var(--text-primary))]">{row.unit}</p>
                  <p className="text-xs text-[hsl(var(--text-tertiary))] mt-0.5">{row.propertyName}</p>
                </div>
              )
            },
            {
              key: 'tenant',
              header: 'Tenant',
              render: (row) => row.tenantName ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] text-[hsl(var(--text-secondary))] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {row.tenantInitial}
                  </div>
                  <span className="text-sm text-[hsl(var(--text-primary))] font-medium">
                    {row.tenantName}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-[hsl(var(--text-tertiary))] italic">
                  Vacant
                </span>
              )
            },
            {
              key: 'rent',
              header: 'Monthly Rent',
              render: (row) => (
                <span className="text-sm font-semibold text-[hsl(var(--text-primary))]">
                  {row.monthlyRent 
                    ? formatCurrency(row.monthlyRent) 
                    : <span className="text-[hsl(var(--text-disabled))] font-normal">—</span>
                  }
                </span>
              )
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => {
                const map: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
                  paid: 'success',
                  overdue: 'danger',
                  pending: 'warning',
                  vacant: 'neutral'
                };
                return (
                  <Badge variant={map[row.status]}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </Badge>
                );
              }
            },
            {
              key: 'dueDate',
              header: 'Due Date',
              className: 'hidden md:table-cell',
              render: (row) => (
                <span className="text-sm text-[hsl(var(--text-secondary))]">
                  {row.dueDate 
                    ? formatDate(row.dueDate) 
                    : <span className="text-[hsl(var(--text-disabled))]">—</span>
                  }
                </span>
              )
            },
            {
              key: 'leaseEnds',
              header: 'Lease Ends',
              className: 'hidden lg:table-cell',
              render: (row) => {
                if (!row.leaseEndsAt) return (
                  <span className="text-[hsl(var(--text-disabled))]">—</span>
                );
                const urgent = row.daysUntilLeaseEnd !== null && row.daysUntilLeaseEnd < 30;
                return (
                  <span className={`text-sm font-medium ${urgent ? 'text-danger-600' : 'text-[hsl(var(--text-secondary))]'}`}>
                    {formatDate(row.leaseEndsAt)}
                    {urgent && (
                      <span className="block text-xs font-normal text-danger-500">
                        {row.daysUntilLeaseEnd}d left
                      </span>
                    )}
                  </span>
                );
              }
            },
            {
              key: 'health',
              header: 'Health',
              className: 'hidden md:table-cell',
              render: (row) => {
                if (!row.healthScore) return (
                  <span className="text-[hsl(var(--text-disabled))] text-sm">—</span>
                );
                const map = {
                  'reliable': 'success',
                  'watch': 'warning',
                  'at-risk': 'danger'
                } as const;
                const labels = {
                  'reliable': 'Reliable',
                  'watch': 'Watch',
                  'at-risk': 'At Risk'
                };
                return (
                  <Badge variant={map[row.healthScore]}>
                    {labels[row.healthScore]}
                  </Badge>
                );
              }
            },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <div className="flex gap-2 justify-end">
                  {row.status !== 'paid' && row.status !== 'vacant' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => handleMarkAsPaid(e, row.id)}
                    >
                      Mark Paid
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (row.tenantId) setSelectedTenantId(row.tenantId);
                    }}
                  >
                    View
                  </Button>
                </div>
              )
            }
          ]}
          onRowClick={(row) => {
            if (row.tenantId) setSelectedTenantId(row.tenantId);
          }}
          emptyState={
            <EmptyState 
              icon={<Grid3x3 size={24} />}
              title="No units match your filters"
              description="Try adjusting your search or filter criteria"
            />
          }
            />
          </Card>
        </div>
      </div>

      <TenantDrawer
        tenantId={selectedTenantId}
        onClose={() => setSelectedTenantId(null)}
        onEdit={(id) => {
          setSelectedTenantId(null);
          setFormMode('edit');
          setFormTenantId(id);
          setFormModalOpen(true);
        }}
      />

        <TenantFormModal
          mode={formMode}
          tenantId={formTenantId}
          open={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSuccess={() => {}}
        />
        
        {confettiAnchor && <ConfettiBurst anchorRef={confettiAnchor} onComplete={() => setConfettiAnchor(null)} />}
      </PageTransition>
    </ErrorBoundary>
  );
};

export default RentRollPage;
