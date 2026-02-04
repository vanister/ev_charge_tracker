import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import type { ThemeMode } from '../types/shared-types';
import { THEME_STORAGE_KEY } from '../constants';
import { getSystemTheme, getStoredTheme, applyTheme } from '../utilities/themeUtils';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider(props: ThemeProviderProps) {
  const { children } = props;
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => getSystemTheme(window));
  const [theme, setTheme] = useState<ThemeMode>(() =>
    getStoredTheme(localStorage, THEME_STORAGE_KEY)
  );

  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      const newSystemTheme = event.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    applyTheme(document.documentElement, theme, systemTheme);
  }, [theme, systemTheme]);

  const updateTheme = async (newTheme: ThemeMode): Promise<void> => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(document.documentElement, newTheme, systemTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
