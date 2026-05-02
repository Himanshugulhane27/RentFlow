import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { SkeletonTableRow } from './Skeleton';
import { staggerContainer, staggerItem, springSnappy } from '../../lib/animations';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
  highlightRowId?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  loading = false,
  emptyState,
  onRowClick,
  className,
  highlightRowId,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={cn('w-full border border-[var(--color-border)] rounded-card overflow-hidden bg-[var(--color-surface-raised)]', className)}>
        <div className="h-12 bg-[var(--color-surface)] border-b border-[var(--color-border)]" />
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonTableRow key={i} cols={columns.length} />
        ))}
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <div className="border border-[var(--color-border)] rounded-card bg-[var(--color-surface-raised)]">{emptyState}</div>;
  }

  return (
    <div className={cn('w-full shadow-[var(--shadow-sm)] border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-surface-raised)] overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
          <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3 text-xs font-semibold text-[hsl(var(--text-secondary))] tracking-wider uppercase leading-none", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {data.map((row, rowIndex) => {
              const rowId = row.id ? row.id.toString() : rowIndex.toString();
              return (
                <motion.tr
                  key={rowId}
                  id={`row-${rowId}`}
                  layout
                  layoutId={rowId}
                  variants={staggerItem}
                  initial="initial"
                  animate={highlightRowId === rowId ? { backgroundColor: ['transparent', 'hsl(var(--warning-light))', 'transparent'] } : "animate"}
                  transition={highlightRowId === rowId ? { duration: 1.5, ease: 'easeInOut' } : springSnappy}
                  whileHover={{ backgroundColor: "var(--color-surface)" }}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'relative bg-[var(--color-surface-raised)] border-b border-[var(--color-border-subtle)] last:border-b-0 transition-colors group',
                    onRowClick && 'cursor-pointer'
                  )}
                  style={{ transitionDuration: 'var(--transition-fast)' }}
                >
                  {/* Row hover accent bar */}
                  <td className="w-0 p-0 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity" style={{ transitionDuration: 'var(--transition-fast)' }} />
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3.5 text-sm text-[hsl(var(--text-primary))]',
                        col.className
                      )}
                    >
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
