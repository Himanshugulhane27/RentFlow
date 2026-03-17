const { validateEmail, validatePhone, validateRequired } = require('../src/utils/validation');

describe('Validation Utils', () => {
  test('should validate correct email', () => {
    expect(validateEmail('john@email.com')).toBe(true);
  });

  test('should reject invalid email', () => {
    expect(validateEmail('not-an-email')).toBe(false);
  });

  test('should throw error for missing required fields', () => {
    expect(() => validateRequired(['name', 'email'], { name: 'John' }))
      .toThrow('Missing required fields: email');
  });

  test('should pass when all required fields present', () => {
    expect(() => validateRequired(['name', 'email'], { name: 'John', email: 'john@email.com' }))
      .not.toThrow();
  });
});