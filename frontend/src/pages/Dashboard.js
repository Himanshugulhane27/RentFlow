import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, color, path }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      style={{
        backgroundColor: color,
        color: 'white',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        cursor: 'pointer',
        flex: '1',
        margin: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}
    >
      <h2 style={{ margin: 0, fontSize: '48px' }}>{value}</h2>
      <p style={{ margin: '10px 0 0', fontSize: '18px' }}>{title}</p>
    </div>
  );
};

const Dashboard = () => {
  const stats = [
    { title: 'Total Properties', value: 3, color: '#1565c0', path: '/properties' },
    { title: 'Active Tenants', value: 2, color: '#2e7d32', path: '/tenants' },
    { title: 'Active Leases', value: 2, color: '#6a1b9a', path: '/leases' },
    { title: 'Monthly Revenue', value: '$2,700', color: '#e65100', path: '/leases' }
  ];

  const recentActivity = [
    { id: 1, message: 'New tenant John Doe added', time: '2 hours ago' },
    { id: 2, message: 'Lease signed for 123 Main St', time: '1 day ago' },
    { id: 3, message: 'Property 789 Pine Rd listed', time: '2 days ago' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Recent Activity</h3>
        {recentActivity.map(activity => (
          <div key={activity.id} style={{ padding: '12px', borderLeft: '4px solid #1a237e', marginBottom: '10px', backgroundColor: '#f5f5f5' }}>
            <p style={{ margin: 0 }}>{activity.message}</p>
            <small style={{ color: '#888' }}>{activity.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;