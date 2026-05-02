import { useState } from 'react';

export function useFirstVisit(key: string) {
  const storageKey = `rf_fv_${key}`;
  const [isFirstVisit, setIsFirstVisit] = useState(() => !localStorage.getItem(storageKey));

  const dismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setIsFirstVisit(false);
  };

  return { isFirstVisit, dismiss };
}
