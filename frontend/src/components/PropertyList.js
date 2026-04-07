import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const PropertyList = ({ properties = [], onDelete, onToggle, onEdit }) => {
  const { leases, tenants } = useApp();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const getCurrentTenant = (propertyId) => {
    const lease = leases.find(l => l.propertyId === propertyId && l.status === 'active');
    if (!lease) return null;
    return tenants.find(t => t.tenantId === lease.tenantId);
  };

  const startEdit = (property) => {
    setEditingId(property.propertyId);
    setEditData({ address: property.address, rent: property.rent, bedrooms: property.bedrooms, bathrooms: property.bathrooms, description: property.description || '' });
  };

  const saveEdit = (propertyId) => {
    onEdit(propertyId, {
      ...editData,
      rent: Number(editData.rent),
      bedrooms: Number(editData.bedrooms),
      bathrooms: Number(editData.bathrooms)
    });
    setEditingId(null);
  };

  if (properties.length === 0) return <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No properties found.</p>;

  return (
    <div>
      {properties.map(property => {
        const currentTenant = getCurrentTenant(property.propertyId);
        return (
          <div key={property.propertyId} style={{
            border: '1px solid #ddd', padding: '15px', borderRadius: '8px',
            marginBottom: '12px', backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            {editingId === property.propertyId ? (
              <div>
                <input value={editData.address} onChange={e => setEditData({ ...editData, address: e.target.value })} placeholder="Address" style={{ marginBottom: '6px' }} />
                <input type="number" value={editData.rent} onChange={e => setEditData({ ...editData, rent: e.target.value })} placeholder="Rent" style={{ marginBottom: '6px' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" value={editData.bedrooms} onChange={e => setEditData({ ...editData, bedrooms: e.target.value })} placeholder="Beds" />
                  <input type="number" value={editData.bathrooms} onChange={e => setEditData({ ...editData, bathrooms: e.target.value })} placeholder="Baths" />
                </div>
                <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} placeholder="Description (optional)" rows={2} style={{ width: '100%', boxSizing: 'border-box', marginTop: '6px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={() => saveEdit(property.propertyId)}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ backgroundColor: '#757575' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', cursor: 'pointer', color: '#1a237e' }} onClick={() => navigate(`/properties/${property.propertyId}`)}>{property.address}</h3>
                  <p style={{ margin: '0 0 4px', color: '#555' }}>
                    💰 ${property.rent}/month &nbsp;|&nbsp;
                    🛏 {property.bedrooms} bed &nbsp;|&nbsp;
                    🚿 {property.bathrooms} bath
                  </p>
                  {currentTenant && (
                    <p style={{ margin: 0, fontSize: '13px', color: '#1565c0' }}>
                      👤 Rented by {currentTenant.name}
                    </p>
                  )}
                  {property.description && (
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#777' }}>{property.description}</p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
                    backgroundColor: property.available ? '#e8f5e9' : '#ffebee',
                    color: property.available ? '#2e7d32' : '#c62828'
                  }}>
                    {property.available ? 'Available' : 'Occupied'}
                  </span>
                  {onEdit && <button onClick={() => startEdit(property)} style={{ backgroundColor: '#1565c0', padding: '6px 12px' }}>Edit</button>}
                  {onToggle && <button onClick={() => onToggle(property.propertyId)} style={{ backgroundColor: '#546e7a', padding: '6px 12px' }}>Toggle</button>}
                  {onDelete && <button onClick={() => onDelete(property.propertyId)} style={{ backgroundColor: '#e53935', padding: '6px 12px' }}>Delete</button>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PropertyList;