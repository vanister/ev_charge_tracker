import Dexie from 'dexie';
import type { EvChargTrackerDb } from './data-types';
import { DB_NAME } from './constants';

export const db = new Dexie(DB_NAME) as EvChargTrackerDb;

// todo - get version from env
db.version(1).stores({
  vehicles: 'id, isActive, createdAt',
  sessions: 'id, vehicleId, locationId, chargedAt, [vehicleId+chargedAt]',
  settings: 'key',
  locations: 'id, isActive, createdAt'
});
