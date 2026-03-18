import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PropertyForm from '../components/PropertyForm';
import PropertyList from '../components/PropertyList';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const PropertiesPage = () => {
  const { properties, addProperty, deleteProperty, toggleAvailability } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
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

  const filtered = properties.filter(p =>
    p.address.toLowerCase().includes(search.toLowerCase())
  );

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
      <input
        placeholder="Search by address..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <PropertyList properties={filtered} onDelete={handleDelete} onToggle={handleToggle} />
    </div>
  );
};

export default PropertiesPage;