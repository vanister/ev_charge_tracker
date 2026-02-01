import Dexie from 'dexie';
import type { EvChargTrackerDb } from './data-types';

export const db = new Dexie('EVChargeTrackerDB') as EvChargTrackerDb;

// todo - get version from env
db.version(1).stores({
  vehicles: 'id, isActive, createdAt',
  sessions: 'id, vehicleId, locationId, chargedAt, [vehicleId+chargedAt]',
  settings: 'key',
  locations: 'id, isActive, createdAt'
});
