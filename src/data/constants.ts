import type { LocationTypeConfig, Settings } from './data-types';

// todo - replace icons with proper SVGs or similar later
export const LOCATION_TYPES: Record<string, LocationTypeConfig> = {
  HOME: {
    key: 'HOME',
    label: 'Home',
    icon: '🏠',
    color: 'blue'
  },
  WORK: {
    key: 'WORK',
    label: 'Work',
    icon: '🏢',
    color: 'purple'
  },
  OTHER: {
    key: 'OTHER',
    label: 'Other',
    icon: '📍',
    color: 'pink'
  },
  DC: {
    key: 'DC',
    label: 'DC',
    icon: '⚡',
    color: 'amber'
  }
};

export const DEFAULT_VEHICLE_ICON = '🚗';

export const DEFAULT_SETTINGS: Settings = {
  key: 'app-settings',
  defaultRates: {
    HOME: 0.12,
    WORK: 0.0,
    OTHER: 0.15,
    DC: 0.35
  },
  onboardingComplete: false
};
