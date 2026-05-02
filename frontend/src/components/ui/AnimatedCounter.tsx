import React, { useEffect, useState } from 'react';
import { useMotionValue, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 600,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(
    prefersReduced ? value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
  );

  useEffect(() => {
    if (prefersReduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayValue(value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      return;
    }
    
    const controls = animate(count, value, {
      duration: duration / 1000,
      onUpdate: (latest) => {
        setDisplayValue(latest.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      }
    });

    return controls.stop;
  }, [value, duration, count, prefersReduced, decimals]);

  return <span>{prefix}{displayValue}{suffix}</span>;
};
