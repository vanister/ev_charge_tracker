import { clsx } from 'clsx';
import { Icon } from '../../components/Icon';
import { useTheme } from '../../hooks/useTheme';
import type { ThemeMode } from '../../types/shared-types';

type ThemeOption = {
  value: ThemeMode;
  label: string;
  icon: 'sun' | 'moon' | 'monitor';
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'monitor' }
];

export function ThemeSectionBody() {
  const { theme, updateTheme } = useTheme();

  return (
    <div className="flex gap-2">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => updateTheme(option.value)}
          className={clsx('flex flex-1 flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors', {
            'bg-primary text-white': theme === option.value,
            'bg-surface text-body-secondary hover:bg-primary/10': theme !== option.value
          })}
        >
          <Icon name={option.icon} size="sm" />
          <span className="text-xs">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
