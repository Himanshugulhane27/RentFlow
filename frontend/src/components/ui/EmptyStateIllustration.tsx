/**
 * Minimal SVG illustration for empty states.
 * Uses CSS custom property colors so it adapts to dark mode automatically.
 */
export function EmptyStateIllustration({
  className = '',
}: {
  className?: string;
}) {
  return (
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      fill="none"
      className={className}
    >
      {/* Back document */}
      <rect
        x="20" y="20" width="56" height="44"
        rx="6"
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth="1.5"
      />
      {/* Front document */}
      <rect
        x="26" y="14" width="56" height="44"
        rx="6"
        fill="var(--color-surface-raised)"
        stroke="var(--color-border)"
        strokeWidth="1.5"
      />
      {/* Content lines */}
      <rect x="34" y="26" width="32" height="2.5" rx="1.25" fill="var(--color-border)" />
      <rect x="34" y="33" width="24" height="2.5" rx="1.25" fill="var(--color-border)" />
      <rect x="34" y="40" width="28" height="2.5" rx="1.25" fill="var(--color-border)" />
    </svg>
  );
}
