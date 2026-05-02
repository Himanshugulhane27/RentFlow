import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  /** The target numeric value to animate to */
  value: number;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Custom formatter — receives the animated number, returns display string */
  formatter?: (n: number) => string;
  /** CSS className for the wrapping span */
  className?: string;
}

/**
 * Animates a number counting up (or down) to its target value using
 * requestAnimationFrame with a cubic ease-out curve.
 *
 * Usage:
 *   <AnimatedNumber value={45200} formatter={(n) => formatCurrency(n)} />
 */
export function AnimatedNumber({
  value,
  duration = 800,
  formatter = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 }),
  className,
}: AnimatedNumberProps) {
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const [display, setDisplay] = useState(() =>
    prefersReduced ? formatter(value) : formatter(0)
  );

  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);
  const prevValue = useRef(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (prefersReduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(formatter(value));
      return;
    }

    startValue.current = prevValue.current;
    startTime.current = null;
    prevValue.current = value;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue.current + (value - startValue.current) * eased;

      setDisplay(formatter(current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, formatter, prefersReduced]);

  return <span className={className}>{display}</span>;
}
