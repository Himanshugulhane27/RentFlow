import crypto from 'crypto';

/**
 * Generate a URL-friendly slug from a string.
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate a unique invoice number: INV-YYYYMM-XXXXX
 */
export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const month = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `INV-${month}-${random}`;
};

/**
 * Calculate the number of days between two dates.
 */
export const daysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((end.getTime() - start.getTime()) / msPerDay);
};

/**
 * Check if a date is in the past.
 */
export const isPast = (date: Date): boolean => {
  return new Date() > date;
};

/**
 * Sanitize string — trim whitespace and remove potential XSS.
 */
export const sanitize = (input: string): string => {
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
