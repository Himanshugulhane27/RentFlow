import type { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  icon: React.ComponentType<LucideProps>;
  size?: number;
}

/**
 * Thin wrapper around Lucide icons that enforces consistent
 * strokeWidth (1.75) and size (18) across the entire app.
 * Use this for icons inside cards, tables, and nav — NOT inside buttons.
 * Button icons should keep strokeWidth={2} for visual weight.
 */
export function Icon({
  icon: LucideIcon,
  size = 18,
  strokeWidth = 1.75,
  ...props
}: IconProps) {
  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
