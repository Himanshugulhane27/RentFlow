import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red';
  onClick?: () => void;
  className?: string;
}

const colorStyles = {
  blue: { icon: 'text-brand-600 bg-brand-50', accent: 'border-t-2 border-t-brand-500' },
  green: { icon: 'text-[hsl(var(--success-dark))] bg-[hsl(var(--success-light))]', accent: 'border-t-2 border-t-[hsl(var(--success))]' },
  amber: { icon: 'text-[hsl(var(--warning-dark))] bg-[hsl(var(--warning-light))]', accent: 'border-t-2 border-t-[hsl(var(--warning))]' },
  red: { icon: 'text-[hsl(var(--danger-dark))] bg-[hsl(var(--danger-light))]', accent: 'border-t-2 border-t-[hsl(var(--danger))]' },
};

const trendColors = {
  up: 'text-[hsl(var(--success))]',
  down: 'text-[hsl(var(--danger))]',
  neutral: 'text-[hsl(var(--text-tertiary))]',
};

const TrendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  trend,
  trendValue,
  icon,
  color = 'blue',
  onClick,
  className,
}) => {
  return (
    <Card 
      hoverable={!!onClick} 
      onClick={onClick}
      className={cn('relative overflow-hidden', colorStyles[color].accent, className)}
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-semibold tracking-wider uppercase text-[hsl(var(--text-tertiary))]">
          {label}
        </p>
        {icon && (
          <div className={cn('w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] flex-shrink-0', colorStyles[color].icon)}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold tabular-nums tracking-tight text-[hsl(var(--text-primary))]">
          {(() => {
            const parseFormattedNumber = (val: string | number) => {
              if (typeof val === 'number') return { isNum: true, num: val, prefix: '', suffix: '', decimals: 0 };
              const match = val.match(/^([^\d-]*)(-?[\d,.]+)([^\d]*)$/);
              if (!match) return { isNum: false, num: 0, prefix: '', suffix: '', decimals: 0 };
              const num = parseFloat(match[2].replace(/,/g, ''));
              if (isNaN(num)) return { isNum: false, num: 0, prefix: '', suffix: '', decimals: 0 };
              return {
                num,
                prefix: match[1],
                suffix: match[3],
                isNum: true,
                decimals: match[2].includes('.') ? match[2].split('.')[1].length : 0
              };
            };
            const parsed = parseFormattedNumber(value);
            return parsed.isNum ? (
              <AnimatedCounter 
                value={parsed.num} 
                prefix={parsed.prefix} 
                suffix={parsed.suffix} 
                decimals={parsed.decimals} 
              />
            ) : (
              value
            );
          })()}
        </h3>
      </div>
      
      {(subtext || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && trendValue && (() => {
            const Icon = TrendIcon[trend];
            return (
              <span className={cn('flex items-center font-medium', trendColors[trend])}>
                <Icon size={14} className="mr-0.5" />
                {trendValue}
              </span>
            );
          })()}
          {subtext && <span className="text-[hsl(var(--text-tertiary))]">{subtext}</span>}
        </div>
      )}
    </Card>
  );
};
