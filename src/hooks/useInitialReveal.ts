import { useEffect, useState } from 'react';

const REVEAL_MS = 420;

export function useInitialReveal() {
  const [isRevealing, setIsRevealing] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsRevealing(false), REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return isRevealing;
}
