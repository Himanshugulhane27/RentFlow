import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, leases, tenants, payments } = useApp();

  const property = properties.find(p => p.propertyId === id);
  if (!property) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p style={{ color: '#888' }}>Property not found.</p>
      <button onClick={() => navigate('/properties')} style={{ marginTop: '16px' }}>Back to Properties</button>
    </div>
  );

  const activeLease = leases.find(l => l.propertyId === id && l.status === 'active');
  const currentTenant = activeLease ? tenants.find(t => t.tenantId === activeLease.tenantId) : null;
  const propertyPayments = activeLease ? payments.filter(p => p.tenantId === activeLease.tenantId) : [];
  const allLeases = leases.filter(l => l.propertyId === id);
  const totalCollected = propertyPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = propertyPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <button onClick={() => navigate('/properties')} style={{ backgroundColor: '#546e7a', marginBottom: '20px', padding: '8px 16px' }}>
        ← Back
      </button>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: '0 0 8px' }}>{property.address}</h2>
            <p style={{ margin: '0 0 4px', color: '#555' }}>💰 ${property.rent}/month</p>
            <p style={{ margin: '0 0 4px', color: '#555' }}>🛏 {property.bedrooms} bedrooms &nbsp;|&nbsp; 🚿 {property.bathrooms} bathrooms</p>
          </div>
          <span style={{
            padding: '6px 16px', borderRadius: '20px', fontSize: '14px',
            backgroundColor: property.available ? '#e8f5e9' : '#ffebee',
            color: property.available ? '#2e7d32' : '#c62828'
          }}>
            {property.available ? 'Available' : 'Occupied'}
          </span>
        </div>
      </div>

      {propertyPayments.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '140px', backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Collected</p>
            <h3 style={{ margin: '6px 0 0', color: '#2e7d32' }}>${totalCollected.toLocaleString()}</h3>
          </div>
          <div style={{ flex: 1, minWidth: '140px', backgroundColor: '#fff3e0', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Pending</p>
            <h3 style={{ margin: '6px 0 0', color: '#e65100' }}>${totalPending.toLocaleString()}</h3>
          </div>
        </div>
      )}

      {currentTenant && (
        <div style={{ backgroundColor: '#e3f2fd', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px', color: '#1565c0' }}>Current Tenant</h3>
          <p style={{ margin: '0 0 4px' }}>
            <strong
              style={{ cursor: 'pointer', color: '#1a237e' }}
              onClick={() => navigate(`/tenants/${currentTenant.tenantId}`)}
            >{currentTenant.name}</strong>
          </p>
          <p style={{ margin: '0 0 4px', color: '#555' }}>📧 {currentTenant.email}</p>
          <p style={{ margin: 0, color: '#555' }}>📞 {currentTenant.phone}</p>
        </div>
      )}

      {activeLease && (
        <div style={{ backgroundColor: '#f1f8e9', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px', color: '#2e7d32' }}>Active Lease</h3>
          <p style={{ margin: '0 0 4px', color: '#555' }}>Period: {activeLease.startDate} → {activeLease.endDate}</p>
          <p style={{ margin: 0, color: '#555' }}>Monthly Rent: <strong>${activeLease.monthlyRent}</strong></p>
        </div>
      )}

      {propertyPayments.length > 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px' }}>Payment History</h3>
          {propertyPayments.map(p => (
            <div key={p.paymentId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: '#555' }}>Due: {p.dueDate}</span>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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

      {allLeases.length > 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 12px' }}>Lease History</h3>
          {allLeases.map(l => (
            <div key={l.leaseId} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{l.tenantName}</span>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                  backgroundColor: l.status === 'active' ? '#e8f5e9' : '#ffebee',
                  color: l.status === 'active' ? '#2e7d32' : '#c62828'
                }}>{l.status}</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#777' }}>{l.startDate} → {l.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;