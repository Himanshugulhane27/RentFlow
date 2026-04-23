// Tests for Property model
const Property = require('../src/models/Property');

describe('Property Model', () => {
  test('creates property with all fields', () => {
    const p = new Property({ propertyId: '1', address: '123 Main St', rent: 1200, bedrooms: 2, bathrooms: 1, available: true });
    expect(p.address).toBe('123 Main St');
    expect(p.rent).toBe(1200);
    expect(p.available).toBe(true);
  });

  test('defaults available to true when not provided', () => {
    const p = new Property({ propertyId: '1', address: '123 Main St', rent: 1200 });
    expect(p.available).toBe(true);
  });

  test('validate passes with address and rent', () => {
    const p = new Property({ propertyId: '1', address: '123 Main St', rent: 1200 });
    expect(p.validate()).toBe(true);
  });

  test('validate throws when address is missing', () => {
    const p = new Property({ propertyId: '1', rent: 1200 });
    expect(() => p.validate()).toThrow('Address and rent are required');
  });

  test('validate throws when rent is missing', () => {
    const p = new Property({ propertyId: '1', address: '123 Main St' });
    expect(() => p.validate()).toThrow('Address and rent are required');
  });
});