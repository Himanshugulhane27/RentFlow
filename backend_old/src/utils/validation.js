/**
 * Validation & sanitization helpers.
 *
 * Keeping user input clean before it ever hits DynamoDB saves us from
 * a whole class of bugs — weird whitespace, script injection via names,
 * or absurd rent values that break the dashboard charts.
 */

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone) => {
  // Accept formats: 555-0100, (555) 555-0100, 555.555.0100, +1-555-555-0100
  const regex = /^[+]?[\d\s().-]{7,20}$/;
  return regex.test(phone);
};

const validateRequired = (fields, data) => {
  const missing = fields.filter(field => !data[field] && data[field] !== 0);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

/**
 * Strip leading/trailing whitespace from all string values in an object.
 * Prevents issues like "  123 Main St  " being stored as a different
 * address than "123 Main St".
 */
const sanitizeStrings = (data) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    cleaned[key] = typeof value === 'string' ? value.trim() : value;
  }
  return cleaned;
};

/**
 * Validate that a value is a positive number.
 * Used for rent amounts, payment amounts, bedroom/bathroom counts, etc.
 */
const validatePositiveNumber = (value, fieldName) => {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }
  return num;
};

/**
 * Validate a date string is in YYYY-MM-DD format and represents a real date.
 */
const validateDateFormat = (dateStr, fieldName) => {
  if (!dateStr) return;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    throw new Error(`${fieldName} must be in YYYY-MM-DD format`);
  }
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    throw new Error(`${fieldName} is not a valid date`);
  }
};

/**
 * Ensure a string doesn't exceed a max length.
 * Simple guard against someone submitting a 10MB address field.
 */
const validateMaxLength = (value, maxLength, fieldName) => {
  if (typeof value === 'string' && value.length > maxLength) {
    throw new Error(`${fieldName} must be ${maxLength} characters or less`);
  }
};

module.exports = {
  validateEmail,
  validatePhone,
  validateRequired,
  sanitizeStrings,
  validatePositiveNumber,
  validateDateFormat,
  validateMaxLength
};