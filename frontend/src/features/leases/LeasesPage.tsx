import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, FileText, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { leaseApi } from '../../api/leases.api';
import { propertyApi } from '../../api/properties.api';
import { tenantApi } from '../../api/tenants.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Lease } from '../../types/models';
import type { CreateLeaseRequest } from '../../types/api';

const LeasesPage: React.FC = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-[var(--font-heading)]">Leases</h1>
          <p className="text-sm text-surface-500 mt-1">{leases.length} leases</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowForm(true)}>New Lease</Button>
      </div>

      <div className="flex gap-2">
        {['all', 'active', 'expired', 'terminated'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${filter === s ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'}`}>
            {s}
          </button>
        ))}
      </div>

      {isLoading ? <CardSkeleton count={4} /> : leases.length === 0 ? (
        <EmptyState title="No leases" description="Create a lease to link tenants with properties." icon={<FileText size={28} />} action={<Button onClick={() => setShowForm(true)} icon={<Plus size={16} />}>New Lease</Button>} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {leases.map((l: Lease) => (
            <Card key={l._id}>
              <div className="flex items-start justify-between mb-3">
                <StatusBadge status={l.status} />
                <span className="text-lg font-bold text-surface-900 dark:text-white">{formatCurrency(l.monthlyRent)}<span className="text-xs font-normal text-surface-400">/mo</span></span>
              </div>
              <p className="font-medium text-sm text-surface-900 dark:text-white">{typeof l.propertyId === 'object' ? l.propertyId.address : 'Property'}</p>
              <p className="text-sm text-surface-500">{typeof l.tenantId === 'object' ? `${l.tenantId.firstName} ${l.tenantId.lastName}` : 'Tenant'}</p>
              <div className="flex items-center gap-1.5 text-xs text-surface-500 mt-2"><Calendar size={12} />{formatDate(l.startDate)} → {formatDate(l.endDate)}</div>
              {l.status === 'active' && (
                <div className="pt-3 mt-3 border-t border-surface-100 dark:border-surface-700">
                  <Button variant="danger" size="sm" onClick={() => terminateM.mutate(l._id)}>Terminate</Button>
                </div>
              )}
            </Card>
          ))}
        </motion.div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create Lease" size="lg">
        <form onSubmit={e => { e.preventDefault(); createM.mutate(form); }} className="space-y-4">
          <Select label="Property" value={form.propertyId} onChange={e => up('propertyId', e.target.value)} options={propOpts} placeholder="Select property" />
          <Select label="Tenant" value={form.tenantId} onChange={e => up('tenantId', e.target.value)} options={tenantOpts} placeholder="Select tenant" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={e => up('startDate', e.target.value)} required />
            <Input label="End Date" type="date" value={form.endDate} onChange={e => up('endDate', e.target.value)} required />
          </div>
          <Input label="Monthly Rent (₹)" type="number" value={form.monthlyRent} onChange={e => up('monthlyRent', Number(e.target.value))} required />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={createM.isPending}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeasesPage;
