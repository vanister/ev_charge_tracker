import type { Settings } from './data-types';

export const DEFAULT_LOCATIONS = [
  {
    name: 'Home',
    icon: '🏠',
    color: 'blue',
    defaultRate: 0.12
  },
  {
    name: 'Work',
    icon: '🏢',
    color: 'purple',
    defaultRate: 0.0
  },
  {
    name: 'Other',
    icon: '📍',
    color: 'pink',
    defaultRate: 0.15
  },
  {
    name: 'DC Fast',
    icon: '⚡',
    color: 'amber',
    defaultRate: 0.35
  }
];

export const DEFAULT_VEHICLE_ICON = '🚗';

export const DEFAULT_SETTINGS: Settings = {
  key: 'app-settings',
  onboardingComplete: false
};
