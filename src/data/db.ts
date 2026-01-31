import Dexie, { type EntityTable } from 'dexie';
import type { Vehicle, ChargingSession, Settings, Location } from './data-types';

export const db = new Dexie('EVChargeTrackerDB') as Dexie & {
  vehicles: EntityTable<Vehicle, 'id'>;
  sessions: EntityTable<ChargingSession, 'id'>;
  settings: EntityTable<Settings, 'key'>;
  locations: EntityTable<Location, 'id'>;
};

// todo - get version from env
db.version(1).stores({
  vehicles: 'id, isActive, createdAt',
  sessions: 'id, vehicleId, locationId, chargedAt, [vehicleId+chargedAt]',
  settings: 'key',
  locations: 'id, isActive, createdAt'
});
