import React, { useState, useEffect } from 'react';
import TenantList from '../components/TenantList';

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    setTenants([
      { tenantId: '1', name: 'John Doe', email: 'john@email.com', phone: '555-0100' },
      { tenantId: '2', name: 'Jane Smith', email: 'jane@email.com', phone: '555-0200' }
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTenants([...tenants, { ...formData, tenantId: Date.now().toString() }]);
    setFormData({ name: '', email: '', phone: '' });
    setShowForm(false);
  };

  const handleDelete = (tenantId) => {
    setTenants(tenants.filter(t => t.tenantId !== tenantId));
  };

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
      <TenantList tenants={tenants} onDelete={handleDelete} />
    </div>
  );
};

export default TenantsPage;