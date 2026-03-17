import React, { useState } from 'react';

const LeasesPage = () => {
  const [leases] = useState([
    { leaseId: '1', propertyAddress: '123 Main St', tenantName: 'John Doe', startDate: '2024-01-01', endDate: '2024-12-31', monthlyRent: 1200, status: 'active' },
    { leaseId: '2', propertyAddress: '456 Oak Ave', tenantName: 'Jane Smith', startDate: '2024-03-01', endDate: '2025-02-28', monthlyRent: 1500, status: 'active' }
  ]);

  const statusColor = (status) => status === 'active' ? '#e8f5e9' : '#ffebee';

  return (
    <div style={{ padding: '20px' }}>
      <h2>Leases</h2>
      {leases.map(lease => (
        <div key={lease.leaseId} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '10px', backgroundColor: statusColor(lease.status) }}>
          <h3>{lease.propertyAddress}</h3>
          <p>Tenant: {lease.tenantName}</p>
          <p>Period: {lease.startDate} → {lease.endDate}</p>
          <p>Monthly Rent: ${lease.monthlyRent} | Status: <strong>{lease.status}</strong></p>
        </div>
      ))}
    </div>
  );
};

export default LeasesPage;