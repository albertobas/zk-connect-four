import { useEffect, useState } from 'react';

/**
 * Hook to check whether the component is mounted.
 *
 * @returns Whether it is mounted or not.
 */
export const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};
