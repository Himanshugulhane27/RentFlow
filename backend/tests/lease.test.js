const Lease = require('../src/models/Lease');

describe('Lease Model', () => {
  test('should create lease with valid data', () => {
    const lease = new Lease({ leaseId: '1', propertyId: 'p1', tenantId: 't1', startDate: '2024-01-01', monthlyRent: 1200 });
    expect(lease.propertyId).toBe('p1');
    expect(lease.status).toBe('active');
  });

  test('should throw error when required fields are missing', () => {
    const lease = new Lease({ leaseId: '1' });
    expect(() => lease.validate()).toThrow('Property, tenant, and start date are required');
  });
});