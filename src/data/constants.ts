import type { Location, Settings } from './data-types';

export const DB_NAME = 'EVChargeTrackerDB';

export const DEFAULT_LOCATIONS: Omit<Location, 'id' | 'createdAt' | 'isActive'>[] = [
  {
    name: 'Home',
    icon: 'home',
    color: 'blue',
    defaultRate: 0.12
  },
  {
    name: 'Work',
    icon: 'building',
    color: 'purple',
    defaultRate: 0.0
  },
  {
    name: 'Other',
    icon: 'map-pin',
    color: 'pink',
    defaultRate: 0.15
  },
  {
    name: 'DC Fast',
    icon: 'zap',
    color: 'amber',
    defaultRate: 0.35
  }
];

export const DEFAULT_VEHICLE_ICON = 'car';
export const DEFAULT_SETTINGS_KEY = 'app-settings';

export const DEFAULT_SETTINGS: Settings = {
  key: DEFAULT_SETTINGS_KEY,
  onboardingComplete: false
};
