import type { Variants, Transition } from 'framer-motion';

export const reducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

// Standard spring — UI elements
export const springStandard: Transition = { type: "spring", stiffness: 400, damping: 30, mass: 0.8 };

// Gentle spring — page transitions, large panels
export const springGentle: Transition = { type: "spring", stiffness: 260, damping: 28, mass: 1 };

// Snappy spring — micro-interactions, buttons
export const springSnappy: Transition = { type: "spring", stiffness: 600, damping: 35, mass: 0.5 };

// Bouncy spring — success states, badges
export const springBouncy: Transition = { type: "spring", stiffness: 500, damping: 20, mass: 0.6 };

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: reducedMotion ? 0 : 16 },
  animate: { opacity: 1, y: 0, transition: springStandard },
  exit: { opacity: 0, y: reducedMotion ? 0 : 16, transition: springStandard },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: reducedMotion ? 0 : 16 },
  animate: { opacity: 1, y: 0, transition: springStandard },
  exit: { opacity: 0, y: reducedMotion ? 0 : 16, transition: springStandard },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: reducedMotion ? 1 : 0.95 },
  animate: { opacity: 1, scale: 1, transition: springSnappy },
  exit: { opacity: 0, scale: reducedMotion ? 1 : 0.95, transition: springSnappy },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: reducedMotion ? 0 : 24 },
  animate: { opacity: 1, x: 0, transition: springStandard },
  exit: { opacity: 0, x: reducedMotion ? 0 : 24, transition: springStandard },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: reducedMotion ? 0 : 12 },
  animate: { opacity: 1, y: 0, transition: springGentle },
  exit: { opacity: 0, y: reducedMotion ? 0 : 12, transition: springGentle },
};

export const popIn: Variants = {
  initial: { scale: 0.85, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: springBouncy },
  exit: { scale: 0.85, opacity: 0, transition: springBouncy },
};

export const slideUp: Variants = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1, transition: springGentle },
  exit: { y: "100%", opacity: 0, transition: springGentle },
};

export const morphScale: Variants = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.03, 1], transition: springSnappy },
};

export const shakeX: Variants = {
  initial: { x: 0 },
  animate: { x: [0, -6, 6, -4, 4, -2, 2, 0], transition: { duration: 0.5 } },
};
