import { cn } from '../../utils/cn';

export function Skeleton({ className, delay = 0 }: { className?: string, delay?: number }) {
  return (
    <div 
      className={cn('shimmer rounded-[var(--radius-md)]', className)} 
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

export function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6">
      <Skeleton delay={delay} className="h-3 w-1/3 mb-4" />
      <Skeleton delay={delay} className="h-8 w-1/2 mb-4" />
      <Skeleton delay={delay} className="h-2 w-full mb-3" />
      <Skeleton delay={delay} className="h-2 w-1/4" />
    </div>
  );
}

export function SkeletonTableRow({ cols, delay = 0 }: { cols: number, delay?: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className={`flex-1 ${i === 0 ? 'max-w-[200px]' : ''}`}>
          <Skeleton delay={delay} className="h-4 w-3/4 mb-1.5" />
          <Skeleton delay={delay} className="h-3 w-1/2 opacity-70" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ rows }: { rows: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading...">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonCard key={i} delay={i * 80} />
      ))}
    </div>
  );
}

export function SkeletonTenantCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 flex items-start gap-4">
      <Skeleton delay={delay} className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <Skeleton delay={delay} className="h-5 w-1/2 mb-3" />
        <Skeleton delay={delay} className="h-3 w-3/4 mb-2" />
        <Skeleton delay={delay} className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonTimelineItem({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative flex gap-4 pb-6">
      <Skeleton delay={delay} className="relative z-10 w-7 h-7 rounded-full flex-shrink-0 border-2 border-[var(--color-surface-raised)]" />
      <div className="flex-1 space-y-2 pt-1">
        <Skeleton delay={delay} className="h-4 w-1/2" />
        <Skeleton delay={delay} className="h-3 w-1/3 opacity-70" />
      </div>
    </div>
  );
}
