import type { Location, Settings } from './data-types';
import { LOCATION_COLOR_HEX } from '../constants';

export const DB_NAME = 'EVChargeTrackerDB';

export const DEFAULT_LOCATIONS: Omit<Location, 'id' | 'createdAt' | 'isActive'>[] = [
  {
    name: 'Home',
    icon: 'home',
    color: LOCATION_COLOR_HEX.teal,
    defaultRate: 0.15,
    order: 0
  },
  {
    name: 'DC Fast Charger',
    icon: 'zap',
    color: LOCATION_COLOR_HEX.orange,
    defaultRate: 0.35,
    order: 1
  },
  {
    name: 'Other',
    icon: 'map-pin',
    color: LOCATION_COLOR_HEX.purple,
    defaultRate: 0.11,
    order: 2
  },
  {
    name: 'Work',
    icon: 'building',
    color: LOCATION_COLOR_HEX.slate,
    defaultRate: 0.17,
    order: 3
  }
];

export const SETTINGS_KEY = 'app-settings';

export const DEFAULT_SETTINGS: Settings = {
  key: SETTINGS_KEY,
  onboardingComplete: false
};
