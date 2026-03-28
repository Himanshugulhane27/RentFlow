import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const TenantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tenants, leases, payments } = useApp();

  const tenant = tenants.find(t => t.tenantId === id);

  if (!tenant) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p style={{ color: '#888' }}>Tenant not found.</p>
      <button onClick={() => navigate('/tenants')} style={{ marginTop: '16px' }}>Back to Tenants</button>
    </div>
  );

  const tenantLeases = leases.filter(l => l.tenantId === id);
  const tenantPayments = payments.filter(p => p.tenantName === tenant.name);
  const totalPaid = tenantPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = tenantPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const isOverdue = (p) => p.status === 'pending' && new Date() > new Date(p.dueDate);

  return (
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <button onClick={() => navigate('/tenants')} style={{ backgroundColor: '#546e7a', marginBottom: '20px', padding: '8px 16px' }}>
        ← Back
      </button>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#1a237e',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', fontWeight: 'bold', flexShrink: 0
          }}>
            {tenant.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px' }}>{tenant.name}</h2>
            <p style={{ margin: '0 0 2px', color: '#555' }}>📧 {tenant.email}</p>
            <p style={{ margin: 0, color: '#555' }}>📞 {tenant.phone}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '140px', backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Total Paid</p>
          <h3 style={{ margin: '6px 0 0', color: '#2e7d32' }}>${totalPaid.toLocaleString()}</h3>
        </div>
        <div style={{ flex: 1, minWidth: '140px', backgroundColor: '#fff3e0', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Pending</p>
          <h3 style={{ margin: '6px 0 0', color: '#e65100' }}>${totalPending.toLocaleString()}</h3>
        </div>
        <div style={{ flex: 1, minWidth: '140px', backgroundColor: '#e3f2fd', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Leases</p>
          <h3 style={{ margin: '6px 0 0', color: '#1565c0' }}>{tenantLeases.length}</h3>
        </div>
      </div>

      {tenantLeases.length > 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Lease History</h3>
          {tenantLeases.map(l => (
            <div key={l.leaseId} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '500' }}>{l.propertyAddress}</span>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                  backgroundColor: l.status === 'active' ? '#e8f5e9' : '#ffebee',
                  color: l.status === 'active' ? '#2e7d32' : '#c62828'
                }}>{l.status}</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#777' }}>
                {l.startDate} → {l.endDate} &nbsp;|&nbsp; ${l.monthlyRent}/mo
              </p>
            </div>
          ))}
        </div>
      )}

      {tenantPayments.length > 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '12px' }}>Payment History</h3>
          {tenantPayments.map(p => (
            <div key={p.paymentId} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #f0f0f0'
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Due: {p.dueDate}</p>
                {isOverdue(p) && <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#e53935' }}>Overdue</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>${p.amount}</span>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                  backgroundColor: p.status === 'paid' ? '#e8f5e9' : '#fff3e0',
                  color: p.status === 'paid' ? '#2e7d32' : '#e65100'
                }}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantDetailPage;