import React from 'react';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  format?: 'currency' | 'percent' | 'number';
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  format = 'number',
  className,
}) => {
  const formattedValue =
    format === 'currency' ? formatCurrency(value as number) :
    format === 'percent' ? formatPercent(value as number) :
    value;

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white">
            {formattedValue}
          </p>
          {change !== undefined && (
            <div className={cn(
              'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
              isPositive && 'text-success-600 bg-success-50 dark:bg-success-500/15 dark:text-success-400',
              isNegative && 'text-danger-600 bg-danger-50 dark:bg-danger-500/15 dark:text-danger-400',
              !isPositive && !isNegative && 'text-surface-500 bg-surface-100 dark:bg-surface-700'
            )}>
              {isPositive && <TrendingUp size={12} />}
              {isNegative && <TrendingDown size={12} />}
              {!isPositive && !isNegative && <Minus size={12} />}
              {isPositive && '+'}
              {change}%
            </div>
          )}
        </div>

        <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center text-primary-600 dark:text-primary-400">
          {icon}
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-primary-500/5 dark:bg-primary-500/10" />
    </Card>
  );
};
