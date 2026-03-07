export type ThemeMode = 'light' | 'dark' | 'system';

export type TimeFilterValue = '7d' | '14d' | '30d' | '31d' | '3m' | '6m' | '12m' | 'all';

export type TimeFilterOption = {
  label: string;
  value: TimeFilterValue;
};

export type DateRange = {
  start: number;
  end: number;
};

export const ALL_ICONS = [
  'home',
  'building',
  'map-pin',
  'zap',
  'car',
  'menu',
  'x',
  'plus',
  'chevron-left',
  'settings',
  'sun',
  'moon',
  'monitor',
  'edit',
  'trash-2',
  'calendar',
  'filter',
  'chevron-down',
  'dollar-sign',
  'trending-up',
  'activity',
  'check-circle',
  'x-circle',
  'alert-triangle',
  'info'
] as const;

export type IconName = (typeof ALL_ICONS)[number];

export type LocationColorOption = { value: string; label: string; bgClass: string };
