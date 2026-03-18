import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TenantList from '../components/TenantList';

const TenantsPage = () => {
  const { tenants, addTenant, deleteTenant } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [search, setSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTenant(formData);
    setFormData({ name: '', email: '', phone: '' });
    setShowForm(false);
  };

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Tenants</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Tenant'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          <input placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          <button type="submit">Add Tenant</button>
        </form>
      )}
      <input
        placeholder="Search by name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <TenantList tenants={filtered} onDelete={deleteTenant} />
    </div>
  );
};

export default TenantsPage;