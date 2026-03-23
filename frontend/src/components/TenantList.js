import React, { useState } from 'react';
import TenantModal from './TenantModal';

const TenantList = ({ tenants = [], onDelete, onEdit }) => {
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (tenant) => {
    setEditingId(tenant.tenantId);
    setEditData({ name: tenant.name, email: tenant.email, phone: tenant.phone });
  };

  const saveEdit = (tenantId) => {
    onEdit(tenantId, editData);
    setEditingId(null);
  };

  if (tenants.length === 0) return <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No tenants found.</p>;

  return (
    <div>
      {selected && <TenantModal tenant={selected} onClose={() => setSelected(null)} />}
      {tenants.map(tenant => (
        <div key={tenant.tenantId} style={{
          border: '1px solid #ddd', padding: '15px', borderRadius: '8px',
          marginBottom: '12px', backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          {editingId === tenant.tenantId ? (
            <div>
              <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} placeholder="Name" style={{ marginBottom: '6px' }} />
              <input value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} placeholder="Email" style={{ marginBottom: '6px' }} />
              <input value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} placeholder="Phone" />
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => saveEdit(tenant.tenantId)}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ backgroundColor: '#757575' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} onClick={() => setSelected(tenant)}>
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
              <div style={{ display: 'flex', gap: '8px' }}>
                {onEdit && <button onClick={() => startEdit(tenant)} style={{ backgroundColor: '#1565c0', padding: '6px 12px' }}>Edit</button>}
                {onDelete && <button onClick={() => onDelete(tenant.tenantId)} style={{ backgroundColor: '#e53935', padding: '6px 12px' }}>Delete</button>}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TenantList;