import React from 'react';

const PropertyList = ({ properties = [], onDelete }) => {
  if (properties.length === 0) return <p>No properties found.</p>;

  return (
    <div>
      {properties.map(property => (
        <div key={property.propertyId} style={{
          border: '1px solid #ddd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '12px',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h3 style={{ margin: '0 0 8px' }}>{property.address}</h3>
            <p style={{ margin: 0, color: '#555' }}>
              💰 ${property.rent}/month &nbsp;|&nbsp;
              🛏 {property.bedrooms} bed &nbsp;|&nbsp;
              🚿 {property.bathrooms} bath
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              backgroundColor: property.available ? '#e8f5e9' : '#ffebee',
              color: property.available ? '#2e7d32' : '#c62828'
            }}>
              {property.available ? 'Available' : 'Occupied'}
            </span>
            {onDelete && (
              <button
                onClick={() => onDelete(property.propertyId)}
                style={{ backgroundColor: '#e53935', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;