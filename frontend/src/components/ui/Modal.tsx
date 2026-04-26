import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { fadeIn, scaleIn } from '../../lib/animations';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-[384px]',
  md: 'max-w-[512px]',
  lg: 'max-w-[672px]',
  xl: 'max-w-[800px]',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
}) => {
  const titleId = React.useId();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef as React.RefObject<HTMLElement>, open);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-hsl(220 20% 10% / 0.5) backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              'glass-strong elevation-5 rounded-[var(--radius-xl)] p-6 z-50 w-full relative flex flex-col max-h-[90vh] overflow-hidden',
              sizeClasses[size]
            )}
          >
            <div className="flex items-start justify-between mb-4 flex-shrink-0">
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-hsl(var(--text-primary))">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-hsl(var(--text-secondary)) mt-1">
                    {description}
                  </p>
                )}
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={onClose}
                className="p-1.5 rounded-[var(--radius-md)] text-hsl(var(--text-tertiary)) hover:bg-hsl(var(--surface-3)) hover:text-hsl(var(--text-primary)) transition-colors focus-ring"
                aria-label="Close modal"
              >
                <X size={18} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-1 -mr-1">
              {children}
            </div>

            {footer && (
              <div className="border-t border-hsl(var(--surface-border)) pt-4 mt-6 flex justify-end gap-3 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
