import type { Location, Settings } from './data-types';

export const DB_NAME = 'EVChargeTrackerDB';

export const DEFAULT_LOCATIONS: Omit<Location, 'id' | 'createdAt' | 'isActive'>[] = [
  {
    name: 'Home',
    icon: 'home',
    color: 'teal',
    defaultRate: 0.15,
    order: 0
  },
  {
    name: 'Work',
    icon: 'building',
    color: 'slate',
    defaultRate: 0.17,
    order: 1
  },
  {
    name: 'DC Fast Charger',
    icon: 'zap',
    color: 'orange',
    defaultRate: 0.35,
    order: 2
  },
  {
    name: 'Other',
    icon: 'map-pin',
    color: 'purple',
    defaultRate: 0.11,
    order: 3
  }
];

export const DEFAULT_VEHICLE_ICON = 'car';
export const SETTINGS_KEY = 'app-settings';

export const DEFAULT_SETTINGS: Settings = {
  key: SETTINGS_KEY,
  onboardingComplete: false
};
