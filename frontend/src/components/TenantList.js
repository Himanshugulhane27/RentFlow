import React, { useState } from 'react';
import TenantModal from './TenantModal';

const TenantList = ({ tenants = [], onDelete }) => {
  const [selected, setSelected] = useState(null);

  if (tenants.length === 0) return <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No tenants found.</p>;

  return (
    <div>
      {selected && <TenantModal tenant={selected} onClose={() => setSelected(null)} />}
      {tenants.map(tenant => (
        <div key={tenant.tenantId} style={{
          border: '1px solid #ddd', padding: '15px', borderRadius: '8px',
          marginBottom: '12px', backgroundColor: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
            onClick={() => setSelected(tenant)}
          >
            <div style={{
              width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#1a237e',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 'bold'
            }}>
              {tenant.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px' }}>{tenant.name}</h3>
              <p style={{ margin: 0, color: '#555' }}>📧 {tenant.email} &nbsp;|&nbsp; 📞 {tenant.phone}</p>
            </div>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(tenant.tenantId)}
              style={{ backgroundColor: '#e53935', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TenantList;