import type { IconName, LocationColorOption } from './types/shared-types';
import type { UserPreferences } from './types/preference-types';

export const THEME_STORAGE_KEY = 'ev-charge-tracker-theme';
export const USER_PREFERENCES_STORAGE_KEY = 'ev-charge-tracker-preferences';

export const RECENT_SESSIONS_LIMIT = 10;

export const DEFAULT_PREFERENCES: UserPreferences = {
  recentSessionsLimit: RECENT_SESSIONS_LIMIT,
  sessionsFilterTimeRange: '31d',
  sessionsFilterIsOpen: true,
  dashboardFilterTimeRange: '31d',
  dashboardFilterIsOpen: true
};

export const PAGE_TRANSITION_DURATION = 150; // ms

export const TOAST_MAX_COUNT = 4;
export const TOAST_DEFAULT_DURATION = 3500;

export const TIME_FILTER_OPTIONS = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 14 Days', value: '14d' },
  { label: 'Last 31 Days', value: '31d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last 12 Months', value: '12m' },
  { label: 'All', value: 'all' }
] as const;

export const LOCATION_ICON_OPTIONS: IconName[] = ['home', 'building', 'map-pin', 'zap', 'car'];

// Hex values matching the CSS custom properties in index.css
export const LOCATION_COLOR_HEX = {
  teal: '#14b8a6', // teal-500
  slate: '#64748b', // slate-500
  purple: '#c084fc', // purple-400
  orange: '#fb923c' // orange-400
} as const;

export const LOCATION_COLOR_OPTIONS: LocationColorOption[] = [
  { value: LOCATION_COLOR_HEX.teal, label: 'Teal', bgClass: 'bg-teal-500' },
  { value: LOCATION_COLOR_HEX.slate, label: 'Slate', bgClass: 'bg-slate-500' },
  { value: LOCATION_COLOR_HEX.purple, label: 'Purple', bgClass: 'bg-purple-400' },
  { value: LOCATION_COLOR_HEX.orange, label: 'Orange', bgClass: 'bg-orange-400' }
];

export const BACKUP_REMINDER_INTERVALS = ['1d', '3d', '7d', '14d', '30d'] as const;
export type BackupReminderInterval = (typeof BACKUP_REMINDER_INTERVALS)[number];

const DAY_MS = 86_400_000;
export const BACKUP_REMINDER_INTERVAL_MS: Record<BackupReminderInterval, number> = {
  '1d': DAY_MS,
  '3d': 3 * DAY_MS,
  '7d': 7 * DAY_MS,
  '14d': 14 * DAY_MS,
  '30d': 30 * DAY_MS
};

export const OAUTH_PROVIDERS = {
  google: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    scope: 'https://www.googleapis.com/auth/drive.appdata'
  }
} as const;
