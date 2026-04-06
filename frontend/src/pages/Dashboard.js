import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const StatCard = ({ title, value, color, path }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(path)} style={{
      backgroundColor: color, color: 'white', padding: '30px',
      borderRadius: '10px', textAlign: 'center', cursor: 'pointer',
      flex: '1', margin: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }}>
      <h2 style={{ margin: 0, fontSize: '48px' }}>{value}</h2>
      <p style={{ margin: '10px 0 0', fontSize: '18px' }}>{title}</p>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { properties, tenants, leases, payments, activity, clearActivity } = useApp();

  const availableCount = properties.filter(p => p.available).length;
  const occupiedCount = properties.filter(p => !p.available).length;
  const occupancyRate = properties.length > 0 ? Math.round((occupiedCount / properties.length) * 100) : 0;
  const activeLeases = leases.filter(l => l.status === 'active');
  const monthlyRevenue = activeLeases.reduce((sum, l) => sum + Number(l.monthlyRent), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const overduePayments = payments.filter(p => p.status === 'pending' && new Date().toISOString().slice(0,10) > p.dueDate).length;

  const expiringThisMonth = leases.filter(l => {
    if (l.status !== 'active') return false;
    const daysLeft = Math.ceil((new Date(l.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 && daysLeft <= 30;
  });

  const stats = [
    { title: 'Total Properties', value: properties.length, color: '#1565c0', path: '/properties' },
    { title: 'Active Tenants', value: tenants.length, color: '#2e7d32', path: '/tenants' },
    { title: 'Active Leases', value: activeLeases.length, color: '#6a1b9a', path: '/leases' },
    { title: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, color: '#e65100', path: '/payments' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/properties')} style={{ backgroundColor: '#1565c0', padding: '8px 14px', fontSize: '13px' }}>+ Property</button>
          <button onClick={() => navigate('/tenants')} style={{ backgroundColor: '#2e7d32', padding: '8px 14px', fontSize: '13px' }}>+ Tenant</button>
          <button onClick={() => navigate('/leases')} style={{ backgroundColor: '#6a1b9a', padding: '8px 14px', fontSize: '13px' }}>+ Lease</button>
          <button onClick={() => navigate('/payments')} style={{ backgroundColor: '#e65100', padding: '8px 14px', fontSize: '13px' }}>+ Payment</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#fff3e0', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#e65100' }}>⚠️ Pending Payments</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{pendingPayments}</p>
        </div>
        <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#ffebee', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#c62828' }}>🔴 Overdue Payments</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{overduePayments}</p>
        </div>
        <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#2e7d32' }}>✅ Available Properties</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{availableCount}</p>
        </div>
      </div>

      {expiringThisMonth.length > 0 && (
        <div style={{ marginTop: '20px', backgroundColor: '#fff8e1', border: '1px solid #ffb300', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 12px', color: '#e65100' }}>⚠️ Leases Expiring This Month ({expiringThisMonth.length})</h4>
          {expiringThisMonth.map(l => {
            const daysLeft = Math.ceil((new Date(l.endDate) - new Date()) / (1000 * 60 * 60 * 24));
            return (
              <div key={l.leaseId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ffe082', fontSize: '14px' }}>
                <span>{l.propertyAddress} — {l.tenantName}</span>
                <span style={{ color: '#e65100', fontWeight: 'bold' }}>{daysLeft}d left</span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: '30px', backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '16px' }}>Occupancy Rate</h3>
        <div style={{ backgroundColor: '#e0e0e0', borderRadius: '20px', height: '20px', overflow: 'hidden' }}>
          <div style={{ width: `${occupancyRate}%`, backgroundColor: '#1565c0', height: '100%', borderRadius: '20px', transition: 'width 0.5s' }} />
        </div>
        <p style={{ marginTop: '8px', color: '#555' }}>{occupiedCount} of {properties.length} properties occupied ({occupancyRate}%)</p>
      </div>

      <div style={{ marginTop: '20px', backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '16px' }}>Revenue by Property</h3>
        {activeLeases.length === 0 && <p style={{ color: '#888' }}>No active leases.</p>}
        {activeLeases.map(lease => (
          <div key={lease.leaseId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: '#333' }}>{lease.propertyAddress}</span>
            <span style={{ fontWeight: 'bold', color: '#2e7d32' }}>${Number(lease.monthlyRent).toLocaleString()}/mo</span>
          </div>
        ))}
        {activeLeases.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0' }}>
            <span style={{ fontWeight: 'bold' }}>Total</span>
            <span style={{ fontWeight: 'bold', color: '#1565c0' }}>${monthlyRevenue.toLocaleString()}/mo</span>
          </div>
        )}
      </div>

      {activity.length > 0 && (
        <div style={{ marginTop: '20px', backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0 }}>Recent Activity</h3>
            <button onClick={clearActivity} style={{ backgroundColor: '#e0e0e0', color: '#555', padding: '4px 12px', fontSize: '13px' }}>Clear</button>
          </div>
          {activity.map(a => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: '#333', fontSize: '14px' }}>{a.message}</span>
              <span style={{ color: '#aaa', fontSize: '12px', whiteSpace: 'nowrap', marginLeft: '12px' }}>{a.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;