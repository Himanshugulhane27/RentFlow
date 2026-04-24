import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Building2, Bed, Bath, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

import { propertyApi } from '../../api/properties.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../utils/formatters';
import { PROPERTY_TYPES } from '../../utils/constants';
import type { Property } from '../../types/models';
import type { CreatePropertyRequest } from '../../types/api';

const defaultForm: CreatePropertyRequest = {
  address: '', city: '', state: '', zipCode: '',
  propertyType: 'apartment', bedrooms: 1, bathrooms: 1,
  rent: 0, description: '',
};

const PropertiesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreatePropertyRequest>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['properties', { search }],
    queryFn: async () => search 
      ? propertyApi.search(search).then(d => ({ success: true, data: d, pagination: undefined })) 
      : propertyApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (d: CreatePropertyRequest) => propertyApi.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property created');
      closeForm();
    },
    onError: (e: { message?: string }) => toast.error(e.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: string; d: Partial<CreatePropertyRequest> }) => propertyApi.update(id, d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property updated');
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted');
    },
  });

  const closeForm = () => { setShowForm(false); setForm(defaultForm); setEditingId(null); };

  const openEdit = (p: Property) => {
    setForm({
      address: p.address, city: p.city, state: p.state, zipCode: p.zipCode,
      propertyType: p.propertyType, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
      rent: p.rent, description: p.description || '',
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateMutation.mutate({ id: editingId, d: form });
    else createMutation.mutate(form);
  };

  const update = (field: string, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const properties = (data?.data || []) as Property[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-[var(--font-heading)]">Properties</h1>
          <p className="text-sm text-surface-500 mt-1">{properties.length} properties</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowForm(true)}>Add Property</Button>
      </div>

      <div className="max-w-sm">
        <Input
          placeholder="Search properties..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search size={16} />}
        />
      </div>

      {isLoading ? (
        <CardSkeleton count={6} />
      ) : properties.length === 0 ? (
        <EmptyState
          title="No properties yet"
          description="Add your first property to start managing your portfolio."
          icon={<Building2 size={28} />}
          action={<Button onClick={() => setShowForm(true)} icon={<Plus size={16} />}>Add Property</Button>}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {properties.map((p: Property) => (
            <Card key={p._id} interactive onClick={() => openEdit(p)}>
              <div className="flex items-start justify-between mb-3">
                <Badge variant={p.available ? 'success' : 'warning'} dot>
                  {p.available ? 'Available' : 'Occupied'}
                </Badge>
                <span className="text-lg font-bold text-primary-600">{formatCurrency(p.rent)}<span className="text-xs font-normal text-surface-400">/mo</span></span>
              </div>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-1 text-sm">{p.address}</h3>
              <div className="flex items-center gap-1 text-xs text-surface-500 mb-3">
                <MapPin size={12} /> {p.city}, {p.state}
              </div>
              <div className="flex items-center gap-4 text-xs text-surface-500 pt-3 border-t border-surface-100 dark:border-surface-700">
                <span className="flex items-center gap-1"><Bed size={14} /> {p.bedrooms} bed</span>
                <span className="flex items-center gap-1"><Bath size={14} /> {p.bathrooms} bath</span>
                <span>{PROPERTY_TYPES[p.propertyType]}</span>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={showForm} onClose={closeForm} title={editingId ? 'Edit Property' : 'Add Property'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Address" value={form.address} onChange={e => update('address', e.target.value)} required />
          <div className="grid grid-cols-3 gap-4">
            <Input label="City" value={form.city} onChange={e => update('city', e.target.value)} required />
            <Input label="State" value={form.state} onChange={e => update('state', e.target.value)} required />
            <Input label="Zip" value={form.zipCode} onChange={e => update('zipCode', e.target.value)} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type" value={form.propertyType} onChange={e => update('propertyType', e.target.value)} options={Object.entries(PROPERTY_TYPES).map(([v, l]) => ({ value: v, label: l }))} />
            <Input label="Bedrooms" type="number" value={form.bedrooms} onChange={e => update('bedrooms', Number(e.target.value))} />
            <Input label="Bathrooms" type="number" value={form.bathrooms} onChange={e => update('bathrooms', Number(e.target.value))} />
          </div>
          <Input label="Monthly Rent (₹)" type="number" value={form.rent} onChange={e => update('rent', Number(e.target.value))} required />
          <Input label="Description" value={form.description || ''} onChange={e => update('description', e.target.value)} />
          <div className="flex gap-3 justify-end pt-2">
            {editingId && <Button variant="danger" type="button" onClick={() => { deleteMutation.mutate(editingId); closeForm(); }}>Delete</Button>}
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

export default PropertiesPage;
