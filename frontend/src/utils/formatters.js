/**
 * Formatting helpers used across multiple pages.
 *
 * Centralizing these prevents the classic problem of one page showing
 * "$1,200.00" and another showing "$1200" for the same rent amount.
 */

/**
 * Format a number as USD currency.
 * formatCurrency(1200)    → "$1,200.00"
 * formatCurrency(1200, 0) → "$1,200"
 */
export const formatCurrency = (amount, decimals = 2) => {
  const num = Number(amount);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

/**
 * Format an ISO date string into a readable format.
 * formatDate('2025-02-01') → "Feb 1, 2025"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Get a human-friendly relative time string.
 * getRelativeTime('2025-04-15T10:00:00Z') → "2 days ago"
 */
export const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(dateStr);
};

/**
 * Truncate a string with ellipsis if it exceeds maxLength.
 * truncate('123 Very Long Street Name', 15) → "123 Very Long S…"
 */
export const truncate = (str, maxLength = 30) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '…';
};

/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
