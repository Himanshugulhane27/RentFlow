import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiBurstProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  onComplete?: () => void;
}

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ anchorRef, onComplete }) => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete?.();
      return;
    }

    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const colors = ['#7F77DD', '#1D9E75', '#D85A30', '#D4537E', '#378ADD'];
    
    const newParticles = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: startX,
      y: startY,
      color: colors[Math.floor(Math.random() * colors.length)],
      dx: (Math.random() - 0.5) * 200, // random dx ±100px
      dy: -(Math.random() * 120 + 60), // dy -60 to -180px
      rotation: Math.random() * 360,
    }));
    
    setParticles(newParticles);
  }, [anchorRef, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[var(--z-toast)] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2"
          style={{ backgroundColor: p.color, left: p.x, top: p.y }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            x: p.dx,
            y: p.dy,
            rotate: p.rotation,
          }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          onAnimationComplete={() => {
            if (p.id === particles[particles.length - 1].id) {
              onComplete?.();
              setParticles([]);
            }
          }}
        />
      ))}
    </div>
  );
};
