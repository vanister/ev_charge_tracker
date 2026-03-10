export type Success<T> = {
  readonly success: true;
  readonly data: T;
};

export type Failure = {
  readonly success: false;
  readonly error: string;
};

export type Result<T> = Success<T> | Failure;

export type ThemeMode = 'light' | 'dark' | 'system';

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
