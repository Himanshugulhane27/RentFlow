import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PropertyForm from '../components/PropertyForm';
import PropertyList from '../components/PropertyList';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import ConfirmDialog from '../components/ConfirmDialog';

const PropertiesPage = () => {
  const { properties, addProperty, deleteProperty, toggleAvailability, editProperty } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [filterAvail, setFilterAvail] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const handleAdd = async (data) => {
    try {
      await addProperty(data);
      setShowForm(false);
      showToast('Property added successfully');
    } catch { showToast('Failed to add property', 'error'); }
  };

  const handleDelete = (id) => setConfirmId(id);

  const confirmDelete = async () => {
    try {
      await deleteProperty(confirmId);
      setConfirmId(null);
      showToast('Property removed', 'error');
    } catch { showToast('Failed to delete property', 'error'); }
  };

  const handleToggle = async (id) => {
    try {
      await toggleAvailability(id);
      showToast('Availability updated', 'info');
    } catch { showToast('Failed to update availability', 'error'); }
  };

  let filtered = properties.filter(p =>
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  if (filterAvail === 'available') filtered = filtered.filter(p => p.available);
  if (filterAvail === 'occupied') filtered = filtered.filter(p => !p.available);

  if (sortBy === 'low') filtered = [...filtered].sort((a, b) => a.rent - b.rent);
  if (sortBy === 'high') filtered = [...filtered].sort((a, b) => b.rent - a.rent);

  return (
    <div style={{ padding: '20px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      {confirmId && <ConfirmDialog message="Delete this property?" onConfirm={confirmDelete} onCancel={() => setConfirmId(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Properties ({filtered.length})</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Property'}
        </button>
      </div>
      {showForm && <PropertyForm onSubmit={handleAdd} />}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          placeholder="Search by address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '180px', marginBottom: 0 }}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto' }}>
          <option value="none">Sort by Rent</option>
          <option value="low">Rent: Low to High</option>
          <option value="high">Rent: High to Low</option>
        </select>
        <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
      </div>

      <PropertyList properties={filtered} onDelete={handleDelete} onToggle={handleToggle} onEdit={async (id, data) => { try { await editProperty(id, data); showToast('Property updated'); } catch { showToast('Failed to update property', 'error'); } }} />
    </div>
  );
};

export default PropertiesPage;