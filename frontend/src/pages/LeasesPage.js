import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const LeasesPage = () => {
  const { leases, addLease, renewLease, terminateLease, properties, tenants } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ propertyId: '', tenantId: '', startDate: '', endDate: '', monthlyRent: '' });
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [renewingId, setRenewingId] = useState(null);
  const [renewDate, setRenewDate] = useState('');
  const { toast, showToast, hideToast } = useToast();

  const getDaysLeft = (endDate) => Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.monthlyRent) <= 0) { setFormError('Monthly rent must be greater than 0'); return; }
    if (formData.endDate <= formData.startDate) { setFormError('End date must be after start date'); return; }
    setFormError('');
    const property = properties.find(p => p.propertyId === formData.propertyId);
    const tenant = tenants.find(t => t.tenantId === formData.tenantId);
    try {
      await addLease({ ...formData, propertyAddress: property?.address || '', tenantName: tenant?.name || '' });
      setFormData({ propertyId: '', tenantId: '', startDate: '', endDate: '', monthlyRent: '' });
      setShowForm(false);
      showToast('Lease created');
    } catch { showToast('Failed to create lease', 'error'); }
  };

  const handleTerminate = async (leaseId) => {
    try {
      await terminateLease(leaseId);
      showToast('Lease terminated', 'error');
    } catch { showToast('Failed to terminate lease', 'error'); }
  };

  const handleRenew = async (leaseId) => {
    if (!renewDate) return;
    try {
      await renewLease(leaseId, renewDate);
      setRenewingId(null);
      setRenewDate('');
      showToast('Lease renewed');
    } catch { showToast('Failed to renew lease', 'error'); }
  };

  const visible = leases.filter(l => {
    const matchSearch = l.tenantName.toLowerCase().includes(search.toLowerCase()) ||
      l.propertyAddress.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: '20px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Leases ({visible.length})</h2>
        <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Lease'}</button>
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
          {formError && <p style={{ color: '#e53935', fontSize: '13px', marginTop: '8px' }}>{formError}</p>}
        </form>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          placeholder="Search by tenant or property..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '180px', marginBottom: 0 }}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      {visible.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No leases found.</p>}

      {visible.map(lease => {
        const daysLeft = getDaysLeft(lease.endDate);
        const expiringSoon = daysLeft <= 30 && daysLeft > 0 && lease.status === 'active';
        const expired = daysLeft <= 0 && lease.status === 'active';

        return (
          <div key={lease.leaseId} style={{
            border: `1px solid ${expiringSoon || expired ? '#ff9800' : '#ddd'}`,
            padding: '15px', borderRadius: '8px', marginBottom: '12px',
            backgroundColor: lease.status === 'terminated' ? '#ffebee' : expiringSoon || expired ? '#fff8e1' : '#f1f8e9',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: '0 0 8px' }}>{lease.propertyAddress}</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {expiringSoon && <span style={{ fontSize: '12px', color: '#e65100', fontWeight: 'bold' }}>⚠️ Expires in {daysLeft}d</span>}
                {expired && <span style={{ fontSize: '12px', color: '#c62828', fontWeight: 'bold' }}>🔴 Expired</span>}
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
                  backgroundColor: lease.status === 'active' ? '#e8f5e9' : '#ffebee',
                  color: lease.status === 'active' ? '#2e7d32' : '#c62828'
                }}>
                  {lease.status}
                </span>
                {lease.status === 'active' && (
                  <button onClick={() => handleTerminate(lease.leaseId)} style={{ backgroundColor: '#e53935', padding: '5px 10px', fontSize: '13px' }}>
                    Terminate
                  </button>
                )}
                <button
                  onClick={() => {
                    const w = window.open('', '_blank');
                    w.document.write(`<html><body style="font-family:sans-serif;padding:32px">
                      <h2>${lease.propertyAddress}</h2>
                      <p><strong>Tenant:</strong> ${lease.tenantName}</p>
                      <p><strong>Period:</strong> ${lease.startDate} → ${lease.endDate}</p>
                      <p><strong>Monthly Rent:</strong> $${lease.monthlyRent}</p>
                      <p><strong>Status:</strong> ${lease.status}</p>
                    </body></html>`);
                    w.document.close();
                    w.print();
                  }}
                  style={{ backgroundColor: '#546e7a', padding: '5px 10px', fontSize: '13px' }}
                >
                  🖨 Print
                </button>
                {(lease.status === 'terminated' || (lease.status === 'active' && (expiringSoon || expired))) && (
                  renewingId === lease.leaseId ? (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input type="date" value={renewDate} onChange={e => setRenewDate(e.target.value)} style={{ margin: 0, padding: '4px 8px', fontSize: '13px' }} />
                      <button onClick={() => handleRenew(lease.leaseId)} style={{ backgroundColor: '#2e7d32', padding: '5px 10px', fontSize: '13px' }}>Confirm</button>
                      <button onClick={() => { setRenewingId(null); setRenewDate(''); }} style={{ backgroundColor: '#757575', padding: '5px 10px', fontSize: '13px' }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setRenewingId(lease.leaseId)} style={{ backgroundColor: '#1565c0', padding: '5px 10px', fontSize: '13px' }}>Renew</button>
                  )
                )}
              </div>
            </div>
            <p style={{ margin: '4px 0', color: '#555' }}>Tenant: {lease.tenantName}</p>
            <p style={{ margin: '4px 0', color: '#555' }}>Period: {lease.startDate} → {lease.endDate}</p>
            <p style={{ margin: '4px 0', color: '#555' }}>Monthly Rent: ${lease.monthlyRent}</p>
          </div>
        );
      })}
    </div>
  );
};

export default LeasesPage;