import type { Location, Settings } from './data-types';

export const DB_NAME = 'EVChargeTrackerDB';

export const DEFAULT_LOCATIONS: Omit<Location, 'id' | 'createdAt' | 'isActive'>[] = [
  {
    name: 'Home',
    icon: 'home',
    color: 'teal',
    defaultRate: 0.15
  },
  {
    name: 'Work',
    icon: 'building',
    color: 'slate',
    defaultRate: 0.17
  },
  {
    name: 'Other',
    icon: 'map-pin',
    color: 'purple',
    defaultRate: 0.11
  },
  {
    name: 'DC Fast Charger',
    icon: 'zap',
    color: 'orange',
    defaultRate: 0.35
  }
];

export const DEFAULT_VEHICLE_ICON = 'car';
export const DEFAULT_SETTINGS_KEY = 'app-settings';

export const DEFAULT_SETTINGS: Settings = {
  key: DEFAULT_SETTINGS_KEY,
  onboardingComplete: false
};
