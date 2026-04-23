const {
  validateEmail,
  validatePhone,
  validateRequired,
  sanitizeStrings,
  validatePositiveNumber,
  validateDateFormat,
  validateMaxLength
} = require('../src/utils/validation');

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    test('should validate correct email', () => {
      expect(validateEmail('john@email.com')).toBe(true);
    });

    test('should reject invalid email', () => {
      expect(validateEmail('not-an-email')).toBe(false);
    });

    test('should reject email without domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    test('should reject email with spaces', () => {
      expect(validateEmail('user @example.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    test('should accept standard format', () => {
      expect(validatePhone('555-0100')).toBe(true);
    });

    test('should accept format with area code', () => {
      expect(validatePhone('(555) 555-0100')).toBe(true);
    });

    test('should accept international format', () => {
      expect(validatePhone('+1-555-555-0100')).toBe(true);
    });

    test('should reject letters in phone number', () => {
      expect(validatePhone('555-CALL')).toBe(false);
    });

    test('should reject too-short numbers', () => {
      expect(validatePhone('123')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    test('should throw error for missing required fields', () => {
      expect(() => validateRequired(['name', 'email'], { name: 'John' }))
        .toThrow('Missing required fields: email');
    });

    test('should pass when all required fields present', () => {
      expect(() => validateRequired(['name', 'email'], { name: 'John', email: 'john@email.com' }))
        .not.toThrow();
    });

    test('should not treat 0 as a missing field', () => {
      expect(() => validateRequired(['amount'], { amount: 0 }))
        .not.toThrow();
    });
  });

  describe('sanitizeStrings', () => {
    test('should trim whitespace from string values', () => {
      const result = sanitizeStrings({ name: '  John  ', age: 25 });
      expect(result.name).toBe('John');
      expect(result.age).toBe(25);
    });

    test('should not modify non-string values', () => {
      const result = sanitizeStrings({ active: true, count: 0 });
      expect(result.active).toBe(true);
      expect(result.count).toBe(0);
    });
  });

  describe('validatePositiveNumber', () => {
    test('should return parsed number for valid input', () => {
      expect(validatePositiveNumber('1200', 'rent')).toBe(1200);
    });

    test('should throw for zero', () => {
      expect(() => validatePositiveNumber(0, 'rent')).toThrow('rent must be a positive number');
    });

    test('should throw for negative values', () => {
      expect(() => validatePositiveNumber(-5, 'rent')).toThrow('rent must be a positive number');
    });

    test('should throw for NaN values', () => {
      expect(() => validatePositiveNumber('abc', 'rent')).toThrow('rent must be a positive number');
    });
  });

  describe('validateDateFormat', () => {
    test('should accept valid YYYY-MM-DD dates', () => {
      expect(() => validateDateFormat('2025-01-15', 'startDate')).not.toThrow();
    });

    test('should reject invalid format', () => {
      expect(() => validateDateFormat('01/15/2025', 'startDate'))
        .toThrow('startDate must be in YYYY-MM-DD format');
    });

    test('should skip validation for empty values', () => {
      expect(() => validateDateFormat(null, 'startDate')).not.toThrow();
      expect(() => validateDateFormat(undefined, 'startDate')).not.toThrow();
    });
  });

  describe('validateMaxLength', () => {
    test('should pass for strings within limit', () => {
      expect(() => validateMaxLength('short', 10, 'name')).not.toThrow();
    });

    test('should throw for strings exceeding limit', () => {
      expect(() => validateMaxLength('a'.repeat(300), 255, 'address'))
        .toThrow('address must be 255 characters or less');
    });

    test('should not throw for non-string values', () => {
      expect(() => validateMaxLength(12345, 3, 'count')).not.toThrow();
    });
  });
});