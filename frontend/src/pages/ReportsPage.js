import React from 'react';
import { useApp } from '../context/AppContext';

const ReportsPage = () => {
  const { properties, tenants, leases, payments } = useApp();

  const totalProperties = properties.length;
  const availableProperties = properties.filter(p => p.available).length;
  const occupiedProperties = totalProperties - availableProperties;
  const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;

  const totalTenants = tenants.length;
  const activeLeases = leases.filter(l => l.status === 'active').length;
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0);
  const overduePayments = payments.filter(p => p.status === 'pending' && new Date().toISOString().slice(0,10) > p.dueDate).length;

  const revenueByProperty = properties.map(prop => {
    const propLeases = leases.filter(l => l.propertyId === prop.propertyId && l.status === 'active');
    const propPayments = payments.filter(p => propLeases.some(l => l.tenantId === p.tenantId) && p.status === 'paid');
    const revenue = propPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    return { address: prop.address, revenue };
  }).sort((a, b) => b.revenue - a.revenue);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Reports & Analytics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Properties</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{totalProperties}</p>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Available: {availableProperties} | Occupied: {occupiedProperties}</p>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Tenants</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{totalTenants}</p>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Active Leases: {activeLeases}</p>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Revenue</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>${totalRevenue.toLocaleString()}</p>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Pending: ${pendingRevenue.toLocaleString()}</p>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>Overdue</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{overduePayments}</p>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Payments</p>
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Occupancy Rate</h3>
        <div style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${occupancyRate}%`, height: '100%', backgroundColor: '#1976d2', transition: 'width 0.3s' }}></div>
        </div>
        <p style={{ textAlign: 'center', margin: '10px 0 0 0' }}>{occupancyRate}% Occupied</p>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h3>Revenue by Property</h3>
        {revenueByProperty.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {revenueByProperty.slice(0, 5).map((prop, index) => (
              <li key={index} style={{ padding: '8px 0', borderBottom: index < 4 ? '1px solid #eee' : 'none' }}>
                <strong>{prop.address}</strong>: ${prop.revenue.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No revenue data available.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;