import { useEffect, type RefObject } from 'react';

const FOCUSABLE_ELEMENTS =
  'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean = true) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const currentRef = ref.current;
    
    // Focus first element on mount
    const focusableElements = currentRef.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS);
    if (focusableElements.length) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const elements = currentRef.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS);
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    currentRef.addEventListener('keydown', handleKeyDown);

    return () => {
      currentRef.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, active]);
}
