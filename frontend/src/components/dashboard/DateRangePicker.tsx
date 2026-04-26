import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDateRange, type DateRange } from '../../store/slices/dashboardSlice';
import { cn } from '../../utils/cn';

const ranges: { value: DateRange; label: string }[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '3m', label: '3M' },
  { value: '12m', label: '1Y' },
  { value: 'all', label: 'All' },
];

export const DateRangePicker: React.FC = () => {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector(state => state.dashboard.dateRange);

  return (
    <div className="glass-medium elevation-2 p-1 rounded-[var(--radius-lg)] flex items-center gap-1 w-max">
      {ranges.map(({ value, label }) => {
        const isActive = dateRange === value;
        return (
          <button
            key={value}
            onClick={() => dispatch(setDateRange(value))}
            className={cn(
              'relative px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-md)] transition-colors focus-ring',
              isActive ? 'text-hsl(var(--brand-600))' : 'text-hsl(var(--text-secondary)) hover:text-hsl(var(--text-primary)) hover:bg-hsl(var(--surface-3))'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="date-range-active"
                className="absolute inset-0 bg-hsl(var(--surface-0)) rounded-[var(--radius-md)] elevation-1"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
