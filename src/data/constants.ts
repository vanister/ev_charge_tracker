import type { LocationRecord, SettingsRecord, SystemConfigRecord } from './data-types';
import { LOCATION_COLOR_HEX } from '../constants';

export const DB_NAME = 'EVChargeTrackerDB';

export const DEFAULT_LOCATIONS: Omit<LocationRecord, 'id' | 'createdAt' | 'isActive'>[] = [
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

export const BACKUP_FILE_VERSION = 1;
export const BACKUP_FILE_NAME = 'ev-charge-tracker-backup.json';

export const SYNC_FILE_VERSION = 1;
export const SYNC_FILE_NAME = 'ev-charge-tracker-sync.json';

export const SETTINGS_KEY = 'app-settings';
export const DEFAULT_SETTINGS: SettingsRecord = {
  key: SETTINGS_KEY,
  onboardingComplete: false,
  backupReminderInterval: '3d'
};

export const SYSTEM_CONFIG_KEY = 'system-config';
export const DEFAULT_SYSTEM_CONFIG: SystemConfigRecord = {
  key: SYSTEM_CONFIG_KEY,
  oAuthSettings: {
    google: {
      provider: 'google',
      clientId: ''
    }
  },
  deviceId: undefined,
  lastSyncAt: undefined
};
