/**
 * Format a number as currency (USD by default).
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string to readable format.
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

/**
 * Format a date as relative time ("2 days ago", "in 5 days").
 */
export const formatRelativeDate = (date: string | Date): string => {
  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

/**
 * Format a percentage.
 */
export const formatPercent = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Truncate a string to maxLength with ellipsis.
 */
export const truncate = (str: string, maxLength: number = 50): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
};

/**
 * Get initials from a name (e.g., "John Doe" → "JD").
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
