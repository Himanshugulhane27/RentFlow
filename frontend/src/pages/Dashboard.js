import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const StatCard = ({ title, value, color, path }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      style={{
        backgroundColor: color, color: 'white', padding: '30px',
        borderRadius: '10px', textAlign: 'center', cursor: 'pointer',
        flex: '1', margin: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}
    >
      <h2 style={{ margin: 0, fontSize: '48px' }}>{value}</h2>
      <p style={{ margin: '10px 0 0', fontSize: '18px' }}>{title}</p>
    </div>
  );
};

const Dashboard = () => {
  const { properties, tenants, leases, payments } = useApp();

  const availableCount = properties.filter(p => p.available).length;
  const activeLeases = leases.filter(l => l.status === 'active').length;
  const monthlyRevenue = leases.filter(l => l.status === 'active').reduce((sum, l) => sum + Number(l.monthlyRent), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  const stats = [
    { title: 'Total Properties', value: properties.length, color: '#1565c0', path: '/properties' },
    { title: 'Active Tenants', value: tenants.length, color: '#2e7d32', path: '/tenants' },
    { title: 'Active Leases', value: activeLeases, color: '#6a1b9a', path: '/leases' },
    { title: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, color: '#e65100', path: '/payments' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#fff3e0', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#e65100' }}>⚠️ Pending Payments</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{pendingPayments}</p>
        </div>
        <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#2e7d32' }}>✅ Available Properties</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{availableCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;