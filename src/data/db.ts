import Dexie, { type EntityTable } from 'dexie';
import type { Vehicle, ChargingSession, Settings } from './data-types';

export const db = new Dexie('EVChargeTrackerDB') as Dexie & {
  vehicles: EntityTable<Vehicle, 'id'>;
  sessions: EntityTable<ChargingSession, 'id'>;
  settings: EntityTable<Settings, 'key'>;
};

// todo - get version from env
db.version(1).stores({
  vehicles: 'id, isActive, createdAt',
  sessions: 'id, vehicleId, chargedAt, [vehicleId+chargedAt]',
  settings: 'key'
});
