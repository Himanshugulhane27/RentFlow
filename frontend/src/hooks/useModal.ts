import { useState, useCallback } from 'react';

export function useModal<T = any>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((payload?: T) => {
    if (payload !== undefined) {
      setData(payload);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Optional: Clear data after animation. 
    // It's safer to clear it immediately or let it stay until next open.
    // We'll let it stay until fully closed (e.g. 200ms) so exit animation doesn't break if dependent on data.
    setTimeout(() => setData(null), 300); 
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { isOpen, open, close, toggle, data };
}
