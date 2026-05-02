import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface OccupancyRingProps {
  percentage: number;
}

export const OccupancyRing: React.FC<OccupancyRingProps> = ({ percentage }) => {
  const radius = 16;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOffset(circumference - (percentage / 100) * circumference);
    } else {
      const timer = setTimeout(() => {
        setOffset(circumference - (percentage / 100) * circumference);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [percentage, circumference]);

  const color = percentage >= 90 ? 'text-success-500' : percentage >= 70 ? 'text-warning-500' : 'text-danger-500';

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-black/5 dark:text-white/10"
        />
        <motion.circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={color}
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
};
