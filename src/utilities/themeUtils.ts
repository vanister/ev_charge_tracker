import type { ThemeMode } from '../types/shared-types';

export function getSystemTheme(window: Window | undefined): 'light' | 'dark' {
  if (!window) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(storage: Storage | undefined, storageKey: string): ThemeMode {
  if (!storage) {
    return 'system';
  }
  const stored = storage.getItem(storageKey);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export function applyTheme(
  rootElement: HTMLElement | undefined,
  theme: ThemeMode,
  systemTheme: 'light' | 'dark'
): void {
  if (!rootElement) {
    return;
  }

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  if (isDark) {
    rootElement.classList.add('dark');
  } else {
    rootElement.classList.remove('dark');
  }
}
