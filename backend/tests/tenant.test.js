const Tenant = require('../src/models/Tenant');

describe('Tenant Model', () => {
  test('should create tenant with valid data', () => {
    const tenant = new Tenant({ tenantId: '1', name: 'John Doe', email: 'john@email.com', phone: '555-0100' });
    expect(tenant.name).toBe('John Doe');
    expect(tenant.email).toBe('john@email.com');
  });

  test('should throw error when name is missing', () => {
    const tenant = new Tenant({ tenantId: '1', email: 'john@email.com' });
    expect(() => tenant.validate()).toThrow('Name and email are required');
  });

  test('should throw error when email is missing', () => {
    const tenant = new Tenant({ tenantId: '1', name: 'John Doe' });
    expect(() => tenant.validate()).toThrow('Name and email are required');
  });
});