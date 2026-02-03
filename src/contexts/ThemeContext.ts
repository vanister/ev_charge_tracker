import { createContext } from 'react';
import type { ThemeMode } from '../types/shared-types';

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  updateTheme: (theme: ThemeMode) => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
