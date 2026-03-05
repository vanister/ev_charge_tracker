import type { IconName, LocationColorOption, TimeFilterOption } from './types/shared-types';

export const THEME_STORAGE_KEY = 'ev-charge-tracker-theme';

export const TOAST_MAX_COUNT = 4;
export const TOAST_DEFAULT_DURATION = 3500;

export const TIME_FILTER_OPTIONS: TimeFilterOption[] = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 14 Days', value: '14d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last 12 Months', value: '12m' },
  { label: 'All', value: 'all' }
];

export const RECENT_SESSIONS_LIMIT = 5;

export const LOCATION_ICON_OPTIONS: IconName[] = ['home', 'building', 'map-pin', 'zap', 'car'];

export const LOCATION_COLOR_OPTIONS: LocationColorOption[] = [
  { value: 'teal', label: 'Teal', bgClass: 'bg-teal-500' },
  { value: 'slate', label: 'Slate', bgClass: 'bg-slate-500' },
  { value: 'purple', label: 'Purple', bgClass: 'bg-purple-400' },
  { value: 'orange', label: 'Orange', bgClass: 'bg-orange-400' }
];
