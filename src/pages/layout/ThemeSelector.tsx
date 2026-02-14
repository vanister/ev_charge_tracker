import { clsx } from 'clsx';
import { Icon } from '../../components/Icon';
import type { ThemeMode } from '../../types/shared-types';

type ThemeSelectorProps = {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
};

export function ThemeSelector(props: ThemeSelectorProps) {
  const { currentTheme, onThemeChange } = props;

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-default p-4">
      <p className="text-xs font-medium text-muted mb-3">Theme</p>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onThemeChange('light')}
          className={clsx('flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors', {
            'bg-primary text-white': currentTheme === 'light',
            'bg-surface text-body-secondary hover:bg-primary/10': currentTheme !== 'light'
          })}
        >
          <Icon name="sun" size="sm" />
          <span className="text-xs">Light</span>
        </button>
        <button
          onClick={() => onThemeChange('dark')}
          className={clsx('flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors', {
            'bg-primary text-white': currentTheme === 'dark',
            'bg-surface text-body-secondary hover:bg-primary/10': currentTheme !== 'dark'
          })}
        >
          <Icon name="moon" size="sm" />
          <span className="text-xs">Dark</span>
        </button>
        <button
          onClick={() => onThemeChange('system')}
          className={clsx('flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors', {
            'bg-primary text-white': currentTheme === 'system',
            'bg-surface text-body-secondary hover:bg-primary/10': currentTheme !== 'system'
          })}
        >
          <Icon name="monitor" size="sm" />
          <span className="text-xs">System</span>
        </button>
      </div>
    </div>
  );
}
