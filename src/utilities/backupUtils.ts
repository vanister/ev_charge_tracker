import { failure, success } from './resultUtils';
import type { Result } from './resultUtils';
import type {
  ChargingSession,
  EvChargTrackerDb,
  Location,
  Settings,
  Vehicle
} from '../data/data-types';
import type { BackupFile } from '../pages/settings/settings-types';

const FILE_VERSION = 1;

export async function exportBackup(db: EvChargTrackerDb): Promise<Result<BackupFile>> {
  try {
    const [vehicles, sessions, locations, settings] = await Promise.all([
      db.vehicles.toArray(),
      db.sessions.toArray(),
      db.locations.toArray(),
      db.settings.toArray()
    ]);
    return success({
      dbVersion: db.verno,
      fileVersion: FILE_VERSION,
      timestamp: Date.now(),
      data: [
        { store: 'vehicles' as const, records: vehicles },
        { store: 'sessions' as const, records: sessions },
        { store: 'locations' as const, records: locations },
        { store: 'settings' as const, records: settings }
      ]
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to export backup data.';
    return failure(msg);
  }
}

export function readBackupFile(file: File): Promise<Result<BackupFile>> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed: unknown = JSON.parse(event.target?.result as string);
        resolve(validateBackup(parsed));
      } catch {
        const msg = 'Failed to parse the backup file. Make sure it is a valid JSON file.';
        resolve(failure(msg));
      }
    };
    reader.onerror = () => resolve(failure('Failed to read the backup file.'));
    reader.readAsText(file);
  });
}

export async function restoreBackup(
  db: EvChargTrackerDb,
  backup: BackupFile
): Promise<Result<void>> {
  if (backup.dbVersion !== db.verno) {
    return failure(
      `Backup database version (${backup.dbVersion}) does not match the app's database version (${db.verno}). Restore is not possible.`
    );
  }

  const getRecords = <T>(storeName: string): T[] => {
    const entry = backup.data.find((s) => s.store === storeName);
    return (entry?.records ?? []) as T[];
  };

  try {
    const tables = [db.vehicles, db.sessions, db.locations, db.settings];
    await db.transaction('rw', tables, async () => {
      await Promise.all([
        db.vehicles.clear(),
        db.sessions.clear(),
        db.locations.clear(),
        db.settings.clear()
      ]);
      await Promise.all([
        db.vehicles.bulkAdd(getRecords<Vehicle>('vehicles')),
        db.sessions.bulkAdd(getRecords<ChargingSession>('sessions')),
        db.locations.bulkAdd(getRecords<Location>('locations')),
        db.settings.bulkAdd(getRecords<Settings>('settings'))
      ]);
    });
    return success(undefined);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to restore backup data.';
    return failure(msg);
  }
}

function validateBackup(parsed: unknown): Result<BackupFile> {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return failure('Backup file is not a valid object.');
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.fileVersion !== 'number' || !Number.isInteger(obj.fileVersion) || obj.fileVersion < 1) {
    return failure('Backup file is missing a valid file version. This file may not be a valid backup.');
  }

  if (typeof obj.dbVersion !== 'number' || !Number.isInteger(obj.dbVersion) || obj.dbVersion < 1) {
    return failure('Backup file is missing a valid database version number.');
  }

  if (typeof obj.timestamp !== 'number') {
    return failure('Backup file is missing a valid timestamp.');
  }

  if (!Array.isArray(obj.data)) {
    return failure('Backup file is missing a "data" array.');
  }

  const findStore = (storeName: string) =>
    obj.data.find(
      (s: unknown) =>
        s &&
        typeof s === 'object' &&
        !Array.isArray(s) &&
        (s as Record<string, unknown>).store === storeName
    ) as Record<string, unknown> | undefined;

  const requiredStores = ['vehicles', 'sessions', 'locations', 'settings'] as const;
  for (const storeName of requiredStores) {
    const storeObj = findStore(storeName);
    if (!storeObj) {
      return failure(`Backup file is missing the "${storeName}" store.`);
    }
    if (!Array.isArray(storeObj.records)) {
      return failure(`Backup file has an invalid "${storeName}" store.`);
    }
  }

  const getStoreRecords = (storeName: string): unknown[] =>
    (findStore(storeName)!.records as unknown[]);

  if (!getStoreRecords('vehicles').every(isValidVehicle)) {
    return failure('Backup file contains an invalid vehicle record.');
  }
  if (!getStoreRecords('locations').every(isValidLocation)) {
    return failure('Backup file contains an invalid location record.');
  }
  if (!getStoreRecords('sessions').every(isValidSession)) {
    return failure('Backup file contains an invalid session record.');
  }
  if (!getStoreRecords('settings').every(isValidSettings)) {
    return failure('Backup file contains an invalid settings record.');
  }

  return success(obj as unknown as BackupFile);
}

function isValidVehicle(v: unknown): v is Vehicle {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const { id, make, model, year, icon, createdAt, isActive } = v as Vehicle;
  return (
    typeof id === 'string' &&
    typeof make === 'string' &&
    typeof model === 'string' &&
    typeof year === 'number' &&
    typeof icon === 'string' &&
    typeof createdAt === 'number' &&
    (isActive === 0 || isActive === 1)
  );
}

function isValidLocation(l: unknown): l is Location {
  if (!l || typeof l !== 'object' || Array.isArray(l)) return false;
  const { id, name, icon, color, defaultRate, createdAt, isActive } = l as Location;
  return (
    typeof id === 'string' &&
    typeof name === 'string' &&
    typeof icon === 'string' &&
    typeof color === 'string' &&
    typeof defaultRate === 'number' &&
    typeof createdAt === 'number' &&
    (isActive === 0 || isActive === 1)
  );
}

function isValidSession(s: unknown): s is ChargingSession {
  if (!s || typeof s !== 'object' || Array.isArray(s)) return false;
  const { id, vehicleId, locationId, energyKwh, ratePerKwh, costCents, chargedAt } =
    s as ChargingSession;
  return (
    typeof id === 'string' &&
    typeof vehicleId === 'string' &&
    typeof locationId === 'string' &&
    typeof energyKwh === 'number' &&
    typeof ratePerKwh === 'number' &&
    typeof costCents === 'number' &&
    typeof chargedAt === 'number'
  );
}

function isValidSettings(s: unknown): s is Settings {
  if (!s || typeof s !== 'object' || Array.isArray(s)) return false;
  const { key, onboardingComplete } = s as Settings;
  return typeof key === 'string' && typeof onboardingComplete === 'boolean';
}
