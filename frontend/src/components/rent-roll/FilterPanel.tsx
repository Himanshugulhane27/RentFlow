import React, { useState, useEffect } from 'react';
import { Search, X, Check, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useDebounce } from '../../hooks/useDebounce';
import { scaleIn, slideUp } from '../../lib/animations';


export interface RentRollFilters {
  search: string;
  status: ('paid' | 'overdue' | 'pending')[];
  rentMin: number | null;
  rentMax: number | null;
  leaseEndBefore: string | null;
  leaseEndAfter: string | null;
  healthScoreMin: number | null;
}

interface FilterPanelProps {
  filters: RentRollFilters;
  onChange: (filters: RentRollFilters) => void;
  onReset: () => void;
  resultCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  resultCount,
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, onChange]);

  const handleStatusToggle = (s: 'paid' | 'overdue' | 'pending') => {
    const newStatus = filters.status.includes(s)
      ? filters.status.filter(st => st !== s)
      : [...filters.status, s];
    onChange({ ...filters, status: newStatus });
  };

  const activeCount = 
    (filters.search ? 1 : 0) + 
    filters.status.length + 
    (filters.rentMin !== null ? 1 : 0) + 
    (filters.rentMax !== null ? 1 : 0) + 
    (filters.leaseEndBefore ? 1 : 0) + 
    (filters.leaseEndAfter ? 1 : 0) + 
    (filters.healthScoreMin !== null ? 1 : 0);

  const content = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))] flex items-center gap-2">
          Filters
          {activeCount > 0 && (
            <span className="bg-[hsl(var(--brand-500))] text-white text-xs rounded-[var(--radius-full)] px-2 py-0.5">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button 
            onClick={() => {
              setLocalSearch('');
              onReset();
            }} 
            className="text-xs text-[hsl(var(--brand-500))] font-medium hover:underline focus-ring rounded-sm"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Input 
            placeholder="Search tenant or unit..." 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            icon={<Search size={16} className="text-[hsl(var(--text-tertiary))]" />}
          />
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wide mb-3">Status</h4>
          <div className="space-y-2">
            {(['paid', 'overdue', 'pending'] as const).map(s => (
              <label key={s} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] group-hover:border-[hsl(var(--brand-400))] transition-colors">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={filters.status.includes(s)}
                    onChange={() => handleStatusToggle(s)}
                  />
                  <AnimatePresence>
                    {filters.status.includes(s) && (
                      <motion.div 
                        variants={scaleIn} 
                        initial="initial" animate="animate" exit="exit"
                        className="absolute inset-0 bg-[hsl(var(--brand-500))] rounded-[var(--radius-sm)] flex items-center justify-center"
                      >
                        <Check size={14} className="text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-sm text-[hsl(var(--text-primary))] capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wide mb-3">Rent Range</h4>
          <div className="flex gap-2">
            <Input 
              type="number" 
              placeholder="Min" 
              value={filters.rentMin || ''} 
              onChange={e => onChange({ ...filters, rentMin: e.target.value ? Number(e.target.value) : null })}
              icon={<span className="text-[hsl(var(--text-tertiary))]">$</span>}
            />
            <Input 
              type="number" 
              placeholder="Max" 
              value={filters.rentMax || ''} 
              onChange={e => onChange({ ...filters, rentMax: e.target.value ? Number(e.target.value) : null })}
              icon={<span className="text-[hsl(var(--text-tertiary))]">$</span>}
            />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wide mb-3">Lease End</h4>
          <div className="space-y-2">
            <Input 
              type="date" 
              label="After"
              value={filters.leaseEndAfter || ''} 
              onChange={e => onChange({ ...filters, leaseEndAfter: e.target.value || null })}
            />
            <Input 
              type="date" 
              label="Before"
              value={filters.leaseEndBefore || ''} 
              onChange={e => onChange({ ...filters, leaseEndBefore: e.target.value || null })}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wide">Min Health</h4>
            {filters.healthScoreMin !== null && (
              <span className="text-xs font-medium text-[hsl(var(--brand-600))] bg-[hsl(var(--brand-50))] px-2 py-0.5 rounded-[var(--radius-md)]">
                {filters.healthScoreMin}+
              </span>
            )}
          </div>
          <input 
            type="range" 
            min="0" max="100" step="5"
            value={filters.healthScoreMin || 0}
            onChange={e => onChange({ ...filters, healthScoreMin: Number(e.target.value) })}
            className="w-full accent-[hsl(var(--brand-500))]"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--color-border)] mt-2">
        <p className="text-xs text-[hsl(var(--text-tertiary))]">
          Showing {resultCount} {resultCount === 1 ? 'tenant' : 'tenants'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-[var(--color-surface-raised)] elevation-2 card-border rounded-[var(--radius-lg)] p-5 sticky top-6">
          {content}
        </div>
      </div>

      <div className="lg:hidden block mb-4">
        <Button 
          variant="secondary" 
          className="w-full justify-between" 
          onClick={() => setIsOpenMobile(true)}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={16} /> Filters
          </span>
          {activeCount > 0 && (
            <span className="bg-[hsl(var(--brand-500))] text-white text-xs rounded-[var(--radius-full)] px-2 py-0.5">
              {activeCount} active
            </span>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-[var(--z-overlay)] flex flex-col justify-end lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[hsl(220 20% 10% / 0.5)] backdrop-blur-sm"
              onClick={() => setIsOpenMobile(false)}
            />
            <motion.div 
              variants={slideUp}
              initial="initial" animate="animate" exit="exit"
              className="relative bg-[var(--color-surface-raised)] rounded-t-[var(--radius-xl)] p-5 max-h-[85vh] overflow-y-auto w-full"
            >
              <div className="flex justify-end mb-2">
                <button onClick={() => setIsOpenMobile(false)} className="p-2 text-[hsl(var(--text-tertiary))] hover:text-[hsl(var(--text-primary))] hover:bg-[var(--color-surface)] rounded-lg transition-colors duration-150 ease-out focus-ring"><X size={20}/></button>
              </div>
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
