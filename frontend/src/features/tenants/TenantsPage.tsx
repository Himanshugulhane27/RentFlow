import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Users, Mail, Phone } from 'lucide-react';
import { toast } from '../../hooks/useToast';

import { tenantApi } from '../../api/tenants.api';
import { paymentApi } from '../../api/payments.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { SlideOver } from '../../components/ui/SlideOver';
import { SkeletonTenantCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ActivityTimeline } from '../../components/ActivityTimeline';
import { PageTransition } from '../../components/ui/PageTransition';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { useActivityTimeline } from '../timeline/hooks/useActivityTimeline';
import { computeHealthScore, getHealthBadgeVariant } from '../../utils/tenantHealthScore';
import { ContextTooltip } from '../../components/ui/ContextTooltip';
import { useFirstVisit } from '../../hooks/useFirstVisit';
import type { Tenant } from '../../types/models';
import type { CreateTenantRequest } from '../../types/api';

const defaultForm: CreateTenantRequest = {
  firstName: '', lastName: '', email: '', phone: '',
};

const TenantsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [form, setForm] = useState<CreateTenantRequest>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const highlightRowId = searchParams.get('highlight') || undefined;
  
  const tooltipAnchorRef = useRef<HTMLDivElement>(null);
  const { isFirstVisit, dismiss: dismissFirstVisit } = useFirstVisit('tenants_tip');

  const { data, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => tenantApi.getAll(),
  });

  const { data: paymentsData } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentApi.getAll(),
  });

  useEffect(() => {
    if (highlightRowId && !isLoading) {
      const el = document.getElementById(`tenant-${highlightRowId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const timer = setTimeout(() => {
          setSearchParams({}, { replace: true });
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [highlightRowId, isLoading, setSearchParams]);

  const createMutation = useMutation({
    mutationFn: (d: CreateTenantRequest) => tenantApi.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tenants'] }); toast.success('Tenant added'); closeForm(); },
    onError: (e: { message?: string }) => toast.error(e.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: string; d: Partial<CreateTenantRequest> }) => tenantApi.update(id, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tenants'] }); toast.success('Tenant updated'); closeForm(); },
  });

  const closeForm = () => { setShowForm(false); setShowDetails(false); setForm(defaultForm); setEditingId(null); setSelectedTenant(null); };

  const openDetails = (t: Tenant) => {
    setSelectedTenant(t);
    setShowDetails(true);
  };

  const openEdit = () => {
    if (selectedTenant) {
      setForm({ firstName: selectedTenant.firstName, lastName: selectedTenant.lastName, email: selectedTenant.email, phone: selectedTenant.phone, notes: selectedTenant.notes });
      setEditingId(selectedTenant._id);
      setShowDetails(false);
      setShowForm(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateMutation.mutate({ id: editingId, d: form });
    else createMutation.mutate(form);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const tenants = (data?.data || []).filter((t: Tenant) =>
    !search || `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const TimelineWrapper = ({ tenantId }: { tenantId: string }) => {
    const { events, isLoading: timelineLoading } = useActivityTimeline('tenant', tenantId);
    return <ActivityTimeline events={events} isLoading={timelineLoading} />;
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--text-primary))]">Tenants</h1>
          <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">{tenants.length} tenants</p>
        </div>
        <div className="flex items-center gap-2">
          <div ref={tooltipAnchorRef}>
            <Button icon={<Plus size={16} />} onClick={() => setShowForm(true)}>Add Tenant</Button>
          </div>
          <ContextTooltip
            isVisible={isFirstVisit}
            onDismiss={dismissFirstVisit}
            text="Add tenants and link them to properties to start managing leases."
            anchorRef={tooltipAnchorRef}
          />
        </div>
      </div>

      <div className="max-w-sm">
        <Input placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} icon={<Search size={16} />} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonTenantCard key={i} />)}
        </div>
      ) : tenants.length === 0 ? (
        <EmptyState 
          title="No tenants yet" 
          description="Add your first tenant to get started." 
          icon={<Users size={28} />} 
          action={{ label: "Add Tenant", onClick: () => setShowForm(true) }} 
        />
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tenants.map((t: Tenant) => {
            const tPayments = paymentsData?.data?.filter(p => (typeof p.tenantId === 'string' ? p.tenantId : (p.tenantId as any)?._id) === t._id) || [];
            const health = computeHealthScore(tPayments);

            return (
              <motion.div key={t._id} id={`tenant-${t._id}`} variants={staggerItem} layout layoutId={t._id} className="relative rounded-[var(--radius-lg)] overflow-hidden">
                <motion.div
                  className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
                  initial={{ opacity: 0 }}
                  animate={highlightRowId === t._id ? { opacity: [0, 1, 0], backgroundColor: 'hsl(var(--warning-light))' } : {}}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                <Card hoverable interactive onClick={() => openDetails(t)}>
                  <div className="flex items-start gap-3">
                  <Avatar name={`${t.firstName} ${t.lastName}`} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[hsl(var(--text-primary))] text-sm truncate">{t.firstName} {t.lastName}</h3>
                      <Badge variant={getHealthBadgeVariant(health.score)} dot>
                        {health.label}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-[hsl(var(--text-tertiary))] flex items-center gap-1.5"><Mail size={12} /> {t.email}</p>
                      <p className="text-xs text-[hsl(var(--text-tertiary))] flex items-center gap-1.5"><Phone size={12} /> {t.phone}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    )}

      {/* Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface-raised)] rounded-xl shadow-dropdown w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-[hsl(var(--text-primary))] mb-4">{editingId ? 'Edit Tenant' : 'Add Tenant'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" value={form.firstName} onChange={e => update('firstName', e.target.value)} required />
                <Input label="Last Name" value={form.lastName} onChange={e => update('lastName', e.target.value)} required />
              </div>
              <Input label="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} required />
              <Input label="Phone" value={form.phone} onChange={e => update('phone', e.target.value)} required />
              <Input label="Notes" value={form.notes || ''} onChange={e => update('notes', e.target.value)} />
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="secondary" type="button" onClick={closeForm}>Cancel</Button>
                <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenant Details SlideOver */}
      <SlideOver open={showDetails} onClose={closeForm} title="Tenant Details" width="lg">
        {selectedTenant && (() => {
          const tPayments = paymentsData?.data?.filter(p => (typeof p.tenantId === 'string' ? p.tenantId : (p.tenantId as any)?._id) === selectedTenant._id) || [];
          const health = computeHealthScore(tPayments);

          return (
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar name={`${selectedTenant.firstName} ${selectedTenant.lastName}`} size="lg" />
                  <div>
                    <h2 className="text-xl font-bold text-[hsl(var(--text-primary))]">{selectedTenant.firstName} {selectedTenant.lastName}</h2>
                    <p className="text-sm text-[hsl(var(--text-tertiary))]">{selectedTenant.email} · {selectedTenant.phone}</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={openEdit}>Edit</Button>
              </div>

              <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)] shadow-none">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))]">Health Score</h3>
                  <Badge variant={getHealthBadgeVariant(health.score)}>{health.label}</Badge>
                </div>
                <p className="text-xs text-[hsl(var(--text-tertiary))]">
                  {tPayments.length} payments analyzed · {health.breakdown.onTime} on time · {health.breakdown.slightlyLate} slightly late · {health.breakdown.veryLate} very late
                </p>
              </Card>

              <div>
                <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-4">Activity Timeline</h3>
                <TimelineWrapper tenantId={selectedTenant._id} />
              </div>
            </div>
          );
        })()}
      </SlideOver>
    </PageTransition>
  );
};

export default TenantsPage;
