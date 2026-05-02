import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, FileText, Calendar } from 'lucide-react';
import { toast } from '../../hooks/useToast';
import { leaseApi } from '../../api/leases.api';
import { propertyApi } from '../../api/properties.api';
import { tenantApi } from '../../api/tenants.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { SlideOver } from '../../components/ui/SlideOver';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ActivityTimeline } from '../../components/ActivityTimeline';
import { PageTransition } from '../../components/ui/PageTransition';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { useActivityTimeline } from '../timeline/hooks/useActivityTimeline';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Lease } from '../../types/models';
import type { CreateLeaseRequest } from '../../types/api';

const TimelineWrapper = ({ leaseId }: { leaseId: string }) => {
  const { events, isLoading: timelineLoading } = useActivityTimeline('lease', leaseId);
  return <ActivityTimeline events={events} isLoading={timelineLoading} />;
};


const LeasesPage: React.FC = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState<CreateLeaseRequest>({
    propertyId: '', tenantId: '', startDate: '', endDate: '', monthlyRent: 0,
  });

  const { data, isLoading } = useQuery({ queryKey: ['leases'], queryFn: () => leaseApi.getAll() });
  const { data: props } = useQuery({ queryKey: ['props-select'], queryFn: () => propertyApi.getAll({ limit: 100 }) });
  const { data: tenants } = useQuery({ queryKey: ['tenants-select'], queryFn: () => tenantApi.getAll({ limit: 100 }) });

  const createM = useMutation({
    mutationFn: (d: CreateLeaseRequest) => leaseApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leases'] }); toast.success('Lease created'); setShowForm(false); },
    onError: (e: { message?: string }) => toast.error(e.message || 'Failed'),
  });

  const terminateM = useMutation({
    mutationFn: (id: string) => leaseApi.terminate(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leases'] }); toast.success('Terminated'); },
  });

  const up = (f: string, v: string | number) => setForm(p => ({ ...p, [f]: v }));
  const leases = (data?.data || []).filter((l: Lease) => filter === 'all' || l.status === filter);
  const propOpts = (props?.data || []).map(p => ({ value: p._id, label: `${p.address}, ${p.city}` }));
  const tenantOpts = (tenants?.data || []).map(t => ({ value: t._id, label: `${t.firstName} ${t.lastName}` }));



  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--text-primary))]">Leases</h1>
          <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">{leases.length} leases</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowForm(true)}>New Lease</Button>
      </div>

      <div className="flex gap-2">
        {['all', 'active', 'expired', 'terminated'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors duration-150 ease-out focus-ring ${filter === s ? 'bg-brand-50 text-brand-700' : 'text-[hsl(var(--text-tertiary))] hover:bg-[var(--color-surface)]'}`}>
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : leases.length === 0 ? (
        <EmptyState 
          title="No leases yet" 
          description="Create a lease to link tenants with properties." 
          icon={<FileText size={28} />} 
          action={{ label: "New Lease", onClick: () => setShowForm(true) }} 
        />
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {leases.map((l: Lease) => (
            <motion.div key={l._id} variants={staggerItem} layout layoutId={l._id}>
              <Card hoverable>
              <div className="flex items-start justify-between mb-3">
                <StatusBadge status={l.status} />
                <span className="text-lg font-bold text-[hsl(var(--text-primary))]">{formatCurrency(l.monthlyRent)}<span className="text-xs font-normal text-[hsl(var(--text-tertiary))]">/mo</span></span>
              </div>
              <p className="font-medium text-sm text-[hsl(var(--text-primary))]">{typeof l.propertyId === 'object' ? l.propertyId.address : 'Property'}</p>
              <p className="text-sm text-[hsl(var(--text-tertiary))]">{typeof l.tenantId === 'object' ? `${l.tenantId.firstName} ${l.tenantId.lastName}` : 'Tenant'}</p>
              <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--text-tertiary))] mt-2"><Calendar size={12} />{formatDate(l.startDate)} → {formatDate(l.endDate)}</div>
              
              <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)] flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => { setSelectedLease(l); setShowDetails(true); }}>View Details</Button>
                {l.status === 'active' && (
                  <Button variant="danger" size="sm" onClick={() => terminateM.mutate(l._id)}>Terminate</Button>
                )}
              </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Create Lease" size="lg">
        <form onSubmit={e => { e.preventDefault(); createM.mutate(form); }} className="space-y-4">
          <Select label="Property" value={form.propertyId} onChange={e => up('propertyId', e.target.value)} options={propOpts} placeholder="Select property" />
          <Select label="Tenant" value={form.tenantId} onChange={e => up('tenantId', e.target.value)} options={tenantOpts} placeholder="Select tenant" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={e => up('startDate', e.target.value)} required />
            <Input label="End Date" type="date" value={form.endDate} onChange={e => up('endDate', e.target.value)} required />
          </div>
          <Input label="Monthly Rent" type="number" value={form.monthlyRent} onChange={e => up('monthlyRent', Number(e.target.value))} required />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={createM.isPending}>Create</Button>
          </div>
        </form>
      </Modal>

      <SlideOver open={showDetails} onClose={() => { setShowDetails(false); setSelectedLease(null); }} title="Lease Details" width="lg">
        {selectedLease && (
          <div className="space-y-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[hsl(var(--text-primary))]">
                  {typeof selectedLease.propertyId === 'object' ? selectedLease.propertyId.address : 'Property'}
                </h2>
                <p className="text-sm text-[hsl(var(--text-tertiary))] mt-1">
                  Tenant: {typeof selectedLease.tenantId === 'object' ? `${selectedLease.tenantId.firstName} ${selectedLease.tenantId.lastName}` : 'Tenant'}
                </p>
              </div>
              <StatusBadge status={selectedLease.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)] shadow-none">
                <p className="text-xs text-[hsl(var(--text-tertiary))] mb-1">Monthly Rent</p>
                <p className="text-lg font-bold text-[hsl(var(--text-primary))]">{formatCurrency(selectedLease.monthlyRent)}</p>
              </Card>
              <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)] shadow-none">
                <p className="text-xs text-[hsl(var(--text-tertiary))] mb-1">Lease Period</p>
                <p className="text-sm font-semibold text-[hsl(var(--text-primary))]">{formatDate(selectedLease.startDate)} → {formatDate(selectedLease.endDate)}</p>
              </Card>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-4">Activity Timeline</h3>
              <TimelineWrapper leaseId={selectedLease._id} />
            </div>
          </div>
        )}
      </SlideOver>
    </PageTransition>
  );
};

export default LeasesPage;
