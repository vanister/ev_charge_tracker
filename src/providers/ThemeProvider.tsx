import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import type { ThemeMode } from '../types/shared-types';

// todo - clean up this file

type ThemeProviderProps = {
  children: ReactNode;
};

const THEME_STORAGE_KEY = 'ev-charge-tracker-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'system';
  }
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function applyTheme(theme: ThemeMode, systemTheme: 'light' | 'dark'): void {
  const root = document.documentElement;
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider(props: ThemeProviderProps) {
  const { children } = props;
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);

  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function handleChange(event: MediaQueryListEvent) {
      const newSystemTheme = event.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
    }

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    applyTheme(theme, systemTheme);
  }, [theme, systemTheme]);

  const updateTheme = async (newTheme: ThemeMode): Promise<void> => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme, systemTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
