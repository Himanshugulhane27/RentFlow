import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Users, Mail, Phone, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

import { tenantApi } from '../../api/tenants.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Tenant } from '../../types/models';
import type { CreateTenantRequest } from '../../types/api';

const defaultForm: CreateTenantRequest = {
  firstName: '', lastName: '', email: '', phone: '',
};

const TenantsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateTenantRequest>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => tenantApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (d: CreateTenantRequest) => tenantApi.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tenants'] }); toast.success('Tenant added'); closeForm(); },
    onError: (e: { message?: string }) => toast.error(e.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: string; d: Partial<CreateTenantRequest> }) => tenantApi.update(id, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tenants'] }); toast.success('Tenant updated'); closeForm(); },
  });

  const closeForm = () => { setShowForm(false); setForm(defaultForm); setEditingId(null); };

  const openEdit = (t: Tenant) => {
    setForm({ firstName: t.firstName, lastName: t.lastName, email: t.email, phone: t.phone, notes: t.notes });
    setEditingId(t._id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateMutation.mutate({ id: editingId, d: form });
    else createMutation.mutate(form);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const getRiskVariant = (score: number): 'success' | 'warning' | 'danger' =>
    score >= 60 ? 'danger' : score >= 30 ? 'warning' : 'success';

  const tenants = (data?.data || []).filter((t: Tenant) =>
    !search || `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-[var(--font-heading)]">Tenants</h1>
          <p className="text-sm text-surface-500 mt-1">{tenants.length} tenants</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowForm(true)}>Add Tenant</Button>
      </div>

      <div className="max-w-sm">
        <Input placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} icon={<Search size={16} />} />
      </div>

      {isLoading ? <CardSkeleton count={6} /> : tenants.length === 0 ? (
        <EmptyState title="No tenants yet" description="Add your first tenant to get started." icon={<Users size={28} />} action={<Button onClick={() => setShowForm(true)} icon={<Plus size={16} />}>Add Tenant</Button>} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tenants.map((t: Tenant) => (
            <Card key={t._id} interactive onClick={() => openEdit(t)}>
              <div className="flex items-start gap-3">
                <Avatar name={`${t.firstName} ${t.lastName}`} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-surface-900 dark:text-white text-sm truncate">{t.firstName} {t.lastName}</h3>
                    {t.riskScore > 0 && (
                      <Badge variant={getRiskVariant(t.riskScore)} dot>
                        {t.riskScore >= 60 ? 'High' : t.riskScore >= 30 ? 'Med' : 'Low'}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-surface-500 flex items-center gap-1.5"><Mail size={12} /> {t.email}</p>
                    <p className="text-xs text-surface-500 flex items-center gap-1.5"><Phone size={12} /> {t.phone}</p>
                  </div>
                  {t.riskScore >= 60 && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-danger-600 dark:text-danger-400">
                      <AlertTriangle size={12} /> Risk score: {t.riskScore}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      <Modal isOpen={showForm} onClose={closeForm} title={editingId ? 'Edit Tenant' : 'Add Tenant'}>
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
      </Modal>
    </div>
  );
};

export default TenantsPage;
