import Dexie from 'dexie';
import type { EvChargTrackerDb } from './data-types';
import { DB_NAME, SETTINGS_KEY } from './constants';
import { DEFAULT_GAS_PRICE_CENTS } from '../constants';

export const db = new Dexie(DB_NAME) as EvChargTrackerDb;

db.version(1).stores({
  vehicles: 'id, isActive, createdAt',
  sessions: 'id, vehicleId, locationId, chargedAt, [vehicleId+chargedAt]',
  settings: 'key',
  locations: 'id, isActive, createdAt, order'
});

db.version(2).stores({
  systemConfig: 'key'
});

db.version(3).stores({
  maintenanceRecords: 'id, vehicleId, performedAt, [vehicleId+performedAt]'
});

db.version(4).stores({
  maintenanceRecords: 'id, vehicleId, servicedAt, [vehicleId+servicedAt]'
});

db.version(5).upgrade(async (tx) => {
  const settings = await tx.table('settings').get(SETTINGS_KEY);
  const gasPriceCents = (settings?.gasPriceCents as number | undefined) ?? DEFAULT_GAS_PRICE_CENTS;

  await tx
    .table('sessions')
    .toCollection()
    .modify((session: Record<string, unknown>) => {
      if (session['gasPriceCents'] === undefined) {
        session['gasPriceCents'] = gasPriceCents;
      }
    });
});

// Opens the new optional `odometer` field on sessions; existing rows are left untouched
// and computeStats() falls back to derived miles when `odometer` is missing.
db.version(6).stores({
  sessions: 'id, vehicleId, locationId, chargedAt, [vehicleId+chargedAt]'
});
