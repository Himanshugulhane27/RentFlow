export function formatCurrency(
  amount: number,
  currency?: string
): string {
  const cur =
    currency ??
    localStorage.getItem('rentflow_currency') ??
    'INR';

  const localeMap: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    GBP: 'en-GB',
    AED: 'ar-AE',
  };

  return new Intl.NumberFormat(
    localeMap[cur] ?? 'en-IN',
    {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 0,
    }
  ).format(amount);
}

export function formatDate(
  date: string | Date
): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(
  date: string | Date
): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function formatPercent(
  value: number, 
  decimals: number = 1
): string {
  return `${value.toFixed(decimals)}%`;
}

export function differenceInDays(
  date1: Date, 
  date2: Date
): number {
  const diffMs = date1.getTime() - date2.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
