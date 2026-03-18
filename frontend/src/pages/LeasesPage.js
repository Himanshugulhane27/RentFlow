import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const LeasesPage = () => {
  const { leases, addLease, properties, tenants } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ propertyId: '', tenantId: '', startDate: '', endDate: '', monthlyRent: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const property = properties.find(p => p.propertyId === formData.propertyId);
    const tenant = tenants.find(t => t.tenantId === formData.tenantId);
    addLease({
      ...formData,
      propertyAddress: property?.address || '',
      tenantName: tenant?.name || ''
    });
    setFormData({ propertyId: '', tenantId: '', startDate: '', endDate: '', monthlyRent: '' });
    setShowForm(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Leases</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Lease'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <select value={formData.propertyId} onChange={e => setFormData({ ...formData, propertyId: e.target.value })} required>
            <option value="">Select Property</option>
            {properties.map(p => <option key={p.propertyId} value={p.propertyId}>{p.address}</option>)}
          </select>
          <select value={formData.tenantId} onChange={e => setFormData({ ...formData, tenantId: e.target.value })} required>
            <option value="">Select Tenant</option>
            {tenants.map(t => <option key={t.tenantId} value={t.tenantId}>{t.name}</option>)}
          </select>
          <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
          <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} required />
          <input type="number" placeholder="Monthly Rent" value={formData.monthlyRent} onChange={e => setFormData({ ...formData, monthlyRent: e.target.value })} required />
          <button type="submit">Create Lease</button>
        </form>
      )}

      {leases.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No leases found.</p>}

      {leases.map(lease => (
        <div key={lease.leaseId} style={{
          border: '1px solid #ddd', padding: '15px', borderRadius: '8px',
          marginBottom: '12px', backgroundColor: lease.status === 'active' ? '#f1f8e9' : '#ffebee',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 8px' }}>{lease.propertyAddress}</h3>
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
              backgroundColor: lease.status === 'active' ? '#e8f5e9' : '#ffebee',
              color: lease.status === 'active' ? '#2e7d32' : '#c62828'
            }}>
              {lease.status}
            </span>
          </div>
          <p style={{ margin: '4px 0', color: '#555' }}>Tenant: {lease.tenantName}</p>
          <p style={{ margin: '4px 0', color: '#555' }}>Period: {lease.startDate} → {lease.endDate}</p>
          <p style={{ margin: '4px 0', color: '#555' }}>Monthly Rent: ${lease.monthlyRent}</p>
        </div>
      ))}
    </div>
  );
};

export default LeasesPage;