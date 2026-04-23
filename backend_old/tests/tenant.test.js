const Tenant = require('../src/models/Tenant');

describe('Tenant Model', () => {
  test('creates tenant with all fields', () => {
    const t = new Tenant({ tenantId: '1', name: 'John Doe', email: 'john@email.com', phone: '555-0100' });
    expect(t.name).toBe('John Doe');
    expect(t.email).toBe('john@email.com');
    expect(t.currentProperty).toBeNull();
  });

  test('validate passes with name and email', () => {
    const t = new Tenant({ tenantId: '1', name: 'John Doe', email: 'john@email.com' });
    expect(t.validate()).toBe(true);
  });

  test('validate throws when name is missing', () => {
    const t = new Tenant({ tenantId: '1', email: 'john@email.com' });
    expect(() => t.validate()).toThrow('Name and email are required');
  });

  test('validate throws when email is missing', () => {
    const t = new Tenant({ tenantId: '1', name: 'John Doe' });
    expect(() => t.validate()).toThrow('Name and email are required');
  });

  test('stores currentProperty when provided', () => {
    const t = new Tenant({ tenantId: '1', name: 'John', email: 'j@j.com', currentProperty: 'prop-1' });
    expect(t.currentProperty).toBe('prop-1');
  });
});