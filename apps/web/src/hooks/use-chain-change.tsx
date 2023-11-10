import { useEffect } from 'react';

export function useChainChange(): void {
  function handleChange(): void {
    window.location.reload();
  }
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChange);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChange);
      }
    };
  }, []);
}
