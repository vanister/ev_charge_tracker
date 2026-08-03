import Dexie from 'dexie';
import type { EvChargTrackerDb } from './data-types';
import { DB_NAME, SETTINGS_KEY } from './constants';
import { DEFAULT_GAS_PRICE_CENTS, LOCATION_COLOR_HEX } from '../constants';

// The teal that was the app's primary color before the move to blue.
const LEGACY_TEAL_LOCATION_COLOR = '#14b8a6';

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

// Retire the old teal location color in favor of blue after the theme moved off teal.
db.version(6).upgrade(async (tx) => {
  await tx
    .table('locations')
    .toCollection()
    .modify((location: Record<string, unknown>) => {
      if (location['color'] === LEGACY_TEAL_LOCATION_COLOR) {
        location['color'] = LOCATION_COLOR_HEX.blue;
      }
    });
});
