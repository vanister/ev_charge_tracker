import { failure, success } from '../../utilities/resultUtils';
import type { Result } from '../../utilities/resultUtils';
import type { ChargingSession, Location, Settings, Vehicle } from '../../data/data-types';
import type { BackupFile } from './settings-types';

const isValidVehicle = (v: unknown): v is Vehicle => {
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
};

const isValidLocation = (l: unknown): l is Location => {
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
};

const isValidSession = (s: unknown): s is ChargingSession => {
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
};

const isValidSettings = (s: unknown): s is Settings => {
  if (!s || typeof s !== 'object' || Array.isArray(s)) return false;
  const { key, onboardingComplete } = s as Settings;
  return typeof key === 'string' && typeof onboardingComplete === 'boolean';
};

export const validateBackup = (parsed: unknown): Result<BackupFile> => {
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
};
