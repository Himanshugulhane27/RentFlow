import React from 'react';
import { useApp } from '../context/AppContext';

const TenantModal = ({ tenant, onClose }) => {
  const { leases, payments } = useApp();

  const tenantLeases = leases.filter(l => l.tenantId === tenant.tenantId);
  const tenantPayments = payments.filter(p => p.tenantName === tenant.name);
  const totalPaid = tenantPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px', width: '480px', maxWidth: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#1a237e',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: 'bold'
            }}>
              {tenant.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{tenant.name}</h3>
              <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>{tenant.email}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ backgroundColor: '#e0e0e0', color: '#333', padding: '6px 14px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
            Close
          </button>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1, backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Total Paid</p>
            <h3 style={{ margin: '4px 0 0', color: '#2e7d32' }}>${totalPaid}</h3>
          </div>
          <div style={{ flex: 1, backgroundColor: '#e3f2fd', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Active Leases</p>
            <h3 style={{ margin: '4px 0 0', color: '#1565c0' }}>{tenantLeases.length}</h3>
          </div>
        </div>

        <p style={{ margin: '0 0 4px', color: '#555' }}>📞 {tenant.phone}</p>

        {tenantLeases.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ marginBottom: '8px' }}>Leases</h4>
            {tenantLeases.map(l => (
              <div key={l.leaseId} style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '6px', marginBottom: '6px' }}>
                <p style={{ margin: 0 }}>{l.propertyAddress}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#777' }}>{l.startDate} → {l.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantModal;