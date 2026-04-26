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
      <div className={cn('w-full border border-neutral-100 rounded-card overflow-hidden bg-white', className)}>
        <div className="h-12 bg-neutral-50 border-b border-neutral-100" />
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonTableRow key={i} cols={columns.length} />
        ))}
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <div className="border border-neutral-100 rounded-card bg-white">{emptyState}</div>;
  }

  return (
    <div className={cn('w-full elevation-2 card-border rounded-[var(--radius-lg)] bg-hsl(var(--surface-0)) overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
          <thead className="bg-hsl(var(--surface-3)) border-b border-hsl(var(--surface-border))">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3 text-xs font-semibold text-hsl(var(--text-secondary)) tracking-wider uppercase", col.className)}>
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
                  animate={highlightRowId === rowId ? { backgroundColor: ['transparent', '#FAEEDA', 'transparent'] } : "animate"}
                  transition={highlightRowId === rowId ? { duration: 1.5, ease: 'easeInOut' } : springSnappy}
                  whileHover={{ backgroundColor: "hsl(var(--surface-2))" }}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'bg-hsl(var(--surface-0)) border-b border-hsl(var(--surface-border)/0.6) last:border-b-0 transition-colors duration-100',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3.5 text-sm text-hsl(var(--text-primary))',
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
