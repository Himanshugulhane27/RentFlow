import { useState, useEffect } from 'react';

/**
 * Debounces a value by the specified delay.
 *
 * I added this because the search inputs on Properties and Tenants were
 * filtering on every single keystroke, which felt janky when there are
 * lots of records. With a 300ms debounce the filtering happens after
 * you stop typing, which feels way more natural.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchTerm, 300);
 *   // use debouncedSearch for filtering instead of searchTerm
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
