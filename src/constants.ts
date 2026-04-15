import type { IconName, LocationColorOption } from './types/shared-types';
import type { UserPreferences } from './types/preference-types';

// Storage keys
export const THEME_STORAGE_KEY = 'ev-charge-tracker-theme';
export const USER_PREFERENCES_STORAGE_KEY = 'ev-charge-tracker-preferences';

// UI
export const PAGE_TRANSITION_DURATION = 150; // ms
export const TOAST_MAX_COUNT = 4;
export const TOAST_DEFAULT_DURATION = 3500;

// Sessions
export const RECENT_SESSIONS_LIMIT = 10;

export const TIME_FILTER_OPTIONS = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 14 Days', value: '14d' },
  { label: 'Last 31 Days', value: '31d' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last 12 Months', value: '12m' },
  { label: 'All', value: 'all' }
] as const;

// Preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  recentSessionsLimit: RECENT_SESSIONS_LIMIT,
  sessionsFilterTimeRange: '31d',
  sessionsFilterIsOpen: false,
  dashboardFilterTimeRange: '31d',
  dashboardFilterIsOpen: false
};

// Locations
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

// Date & time format
export const DATE_FORMAT_OPTIONS = [
  { label: 'Default', value: 'medium' },
  { label: 'US', value: 'us-short' },
  { label: 'EU', value: 'eu-short' },
  { label: 'ISO', value: 'iso' }
] as const;

export const TIME_FORMAT_OPTIONS = [
  { label: 'Default', value: 'auto' },
  { label: '12h', value: '12h' },
  { label: '24h', value: '24h' },
  { label: '24h:ss', value: '24h-seconds' }
] as const;

// Maintenance
export const DATE_INPUT_FORMAT = 'yyyy-MM-dd';

export const MAINTENANCE_TYPES = [
  'tire_rotation',
  'tire_replacement',
  'brake_service',
  'battery_service',
  'software_update',
  'inspection',
  'cabin_filter',
  'wiper_replacement',
  'coolant_service',
  'other'
] as const;

export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number];

// Gas Comparison
// EPA standard: 1 gallon of gasoline = 33.7 kWh of energy
export const KWH_PER_GALLON = 33.7;
export const DEFAULT_GAS_PRICE_CENTS = 350; // $3.50/gal
export const DEFAULT_COMPARISON_MPG = 40;
export const DEFAULT_MI_PER_KWH = 2.7;

// Backup
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

// OAuth
export const OAUTH_PROVIDERS = {
  google: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    scope: 'https://www.googleapis.com/auth/drive.appdata'
  }
} as const;
