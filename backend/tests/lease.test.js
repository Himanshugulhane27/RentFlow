const Lease = require('../src/models/Lease');

describe('Lease Model', () => {
  test('creates lease with valid data', () => {
    const l = new Lease({ leaseId: '1', propertyId: 'p1', tenantId: 't1', startDate: '2024-01-01', endDate: '2024-12-31', monthlyRent: 1200 });
    expect(l.propertyId).toBe('p1');
    expect(l.status).toBe('active');
  });

  test('defaults status to active', () => {
    const l = new Lease({ leaseId: '1', propertyId: 'p1', tenantId: 't1', startDate: '2024-01-01' });
    expect(l.status).toBe('active');
  });

  test('validate passes with required fields', () => {
    const l = new Lease({ leaseId: '1', propertyId: 'p1', tenantId: 't1', startDate: '2024-01-01' });
    expect(l.validate()).toBe(true);
  });

  test('validate throws when propertyId is missing', () => {
    const l = new Lease({ leaseId: '1', tenantId: 't1', startDate: '2024-01-01' });
    expect(() => l.validate()).toThrow('Property, tenant, and start date are required');
  });

  test('validate throws when startDate is missing', () => {
    const l = new Lease({ leaseId: '1', propertyId: 'p1', tenantId: 't1' });
    expect(() => l.validate()).toThrow('Property, tenant, and start date are required');
  });
});