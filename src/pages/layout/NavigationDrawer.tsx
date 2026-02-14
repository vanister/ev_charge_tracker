import { clsx } from 'clsx';
import { NavigationDrawerHeader } from './NavigationDrawerHeader';
import { NavigationLinks } from './NavigationLinks';
import { ThemeSelector } from './ThemeSelector';
import type { ThemeMode } from '../../types/shared-types';

type NavigationDrawerProps = {
  isOpen: boolean;
  currentPath: string;
  currentTheme: ThemeMode;
  onClose: () => void;
  onThemeChange: (theme: ThemeMode) => void;
};

export function NavigationDrawer(props: NavigationDrawerProps) {
  const { isOpen, currentPath, currentTheme, onClose, onThemeChange } = props;

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-surface z-30',
        'transition-transform duration-300 will-change-transform',
        {
          'translate-x-0': isOpen,
          '-translate-x-full': !isOpen
        }
      )}
    >
      <NavigationDrawerHeader onClose={onClose} />
      <NavigationLinks currentPath={currentPath} onNavigate={onClose} />
      <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
    </nav>
  );
}
