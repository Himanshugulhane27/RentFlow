import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ContextTooltip: React.FC<{
  isVisible: boolean;
  onDismiss: () => void;
  text: string;
  anchorRef: React.RefObject<HTMLElement | null>;
}> = ({ isVisible, onDismiss, text, anchorRef }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isVisible && anchorRef.current) {
      const updatePosition = () => {
        if (!anchorRef.current) return;
        const rect = anchorRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + 8,
          left: rect.left + rect.width / 2,
        });
      };
      
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isVisible, anchorRef]);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isVisible || !anchorRef.current) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: '-50%' }}
          animate={{ opacity: 1, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
          transition={{ duration: prefersReduced ? 0 : 0.18 }}
          style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 60 }}
          className="bg-white text-neutral-800 border border-neutral-200 rounded-lg shadow-sm p-3 w-full max-w-[240px] text-[13px]"
        >
          {/* subtle triangle pointer */}
          <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-t border-l border-neutral-200 rotate-45 rounded-sm" />
          <div className="relative z-10 flex flex-col gap-2">
            <p className="leading-snug">{text}</p>
            <button 
              onClick={onDismiss}
              className="self-end font-semibold text-brand-600 hover:text-brand-800 transition-colors"
            >
              Got it &rarr;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
