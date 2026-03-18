import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PropertyForm from '../components/PropertyForm';
import PropertyList from '../components/PropertyList';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const PropertiesPage = () => {
  const { properties, addProperty, deleteProperty, toggleAvailability, editProperty } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [filterAvail, setFilterAvail] = useState('all');
  const { toast, showToast, hideToast } = useToast();

  const handleAdd = (data) => {
    addProperty(data);
    setShowForm(false);
    showToast('Property added successfully');
  };

  const handleDelete = (id) => {
    deleteProperty(id);
    showToast('Property removed', 'error');
  };

  const handleToggle = (id) => {
    toggleAvailability(id);
    showToast('Availability updated', 'info');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Properties</h2>
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

      <PropertyList properties={filtered} onDelete={handleDelete} onToggle={handleToggle} onEdit={(id, data) => { editProperty(id, data); showToast('Property updated'); }} />
    </div>
  );
};

export default PropertiesPage;