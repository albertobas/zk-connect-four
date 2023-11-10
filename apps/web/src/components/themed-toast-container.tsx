import { useCallback, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

export function ThemedToastContainer(): JSX.Element {
  const [isDark, setIsDark] = useState<boolean>(false);

  const applyTheme = useCallback(
    (mqList: MediaQueryList | MediaQueryListEvent) => {
      const theme = mqList.matches ? 'dark' : 'light';
      setIsDark(theme === 'dark');
      const d = document.documentElement;
      d.setAttribute('data-theme', theme);
      d.style.colorScheme = theme;
    },
    []
  );

  useEffect(() => {
    const mqList = window.matchMedia('(prefers-color-scheme: dark)');
    mqList.addListener(applyTheme);
    applyTheme(mqList);
    return () => {
      mqList.removeListener(applyTheme);
    };
  }, [applyTheme]);

  return (
    <ToastContainer
      hideProgressBar={false}
      newestOnTop
      pauseOnFocusLoss
      pauseOnHover
      position="bottom-right"
      rtl={false}
      theme={isDark ? 'dark' : 'light'}
    />
  );
}
