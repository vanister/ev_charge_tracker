import type { Location, Settings } from './data-types';

export const DB_NAME = 'EVChargeTrackerDB';

export const DEFAULT_LOCATIONS: Omit<Location, 'id' | 'createdAt' | 'isActive'>[] = [
  {
    name: 'Home',
    icon: 'home',
    color: '#14b8a6',
    defaultRate: 0.15,
    order: 0
  },
  {
    name: 'DC Fast Charger',
    icon: 'zap',
    color: '#fb923c',
    defaultRate: 0.35,
    order: 1
  },
  {
    name: 'Other',
    icon: 'map-pin',
    color: '#c084fc',
    defaultRate: 0.11,
    order: 2
  },
  {
    name: 'Work',
    icon: 'building',
    color: '#64748b',
    defaultRate: 0.17,
    order: 3
  }
];

export const SETTINGS_KEY = 'app-settings';

export const DEFAULT_SETTINGS: Settings = {
  key: SETTINGS_KEY,
  onboardingComplete: false
};
