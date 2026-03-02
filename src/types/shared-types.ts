export type ThemeMode = 'light' | 'dark' | 'system';

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
  'activity'
] as const;

export type IconName = (typeof ALL_ICONS)[number];
