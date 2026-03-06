import { failure, success } from './resultUtils';
import type { Result } from './resultUtils';
import type {
  ChargingSession,
  EvChargTrackerDb,
  Location,
  Settings,
  Vehicle
} from '../data/data-types';

export type BackupFile = {
  version: number;
  vehicles: Vehicle[];
  sessions: ChargingSession[];
  locations: Location[];
  settings: Settings[];
};

export async function exportBackup(db: EvChargTrackerDb): Promise<Result<BackupFile>> {
  try {
    const [vehicles, sessions, locations, settings] = await Promise.all([
      db.vehicles.toArray(),
      db.sessions.toArray(),
      db.locations.toArray(),
      db.settings.toArray()
    ]);
    return success({ version: db.verno, vehicles, sessions, locations, settings });
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
  if (backup.version !== db.verno) {
    return failure(`Backup version (${backup.version}) does not match the app's database version (${db.verno}). Restore is not possible.`);
  }

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
        db.vehicles.bulkPut(backup.vehicles),
        db.sessions.bulkPut(backup.sessions),
        db.locations.bulkPut(backup.locations),
        db.settings.bulkPut(backup.settings)
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

  if (typeof obj.version !== 'number' || !Number.isInteger(obj.version) || obj.version < 1) {
    return failure('Backup file is missing a valid version number.');
  }

  if (!Array.isArray(obj.vehicles)) {
    return failure('Backup file is missing a "vehicles" array.');
  }
  if (!Array.isArray(obj.sessions)) {
    return failure('Backup file is missing a "sessions" array.');
  }
  if (!Array.isArray(obj.locations)) {
    return failure('Backup file is missing a "locations" array.');
  }
  if (!Array.isArray(obj.settings)) {
    return failure('Backup file is missing a "settings" array.');
  }

  if (!obj.vehicles.every(isValidVehicle)) {
    return failure('Backup file contains an invalid vehicle record.');
  }
  if (!obj.locations.every(isValidLocation)) {
    return failure('Backup file contains an invalid location record.');
  }
  if (!obj.sessions.every(isValidSession)) {
    return failure('Backup file contains an invalid session record.');
  }
  if (!obj.settings.every(isValidSettings)) {
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
