import { failure, success } from './resultUtils';
import type { Result } from '../types/shared-types';
import type {
  ChargingSessionRecord,
  EvChargTrackerDb,
  LocationRecord,
  MaintenanceRecord,
  SettingsRecord,
  VehicleRecord
} from '../data/data-types';
import type { BackupFile } from '../pages/settings/settings-types';
import { BACKUP_FILE_VERSION } from '../data/constants';
import { BackupFileSchema } from '../data/backup-schema';
import { BACKUP_REMINDER_INTERVAL_MS, type BackupReminderInterval } from '../constants';

export async function exportBackup(db: EvChargTrackerDb): Promise<Result<BackupFile>> {
  try {
    const [vehicles, sessions, locations, settings, maintenanceRecords] = await Promise.all([
      db.vehicles.toArray(),
      db.sessions.toArray(),
      db.locations.toArray(),
      db.settings.toArray(),
      db.maintenanceRecords.toArray()
    ]);

    return success({
      dbVersion: db.verno,
      fileVersion: BACKUP_FILE_VERSION,
      timestamp: Date.now(),
      data: [
        { store: 'vehicles' as const, records: vehicles },
        { store: 'sessions' as const, records: sessions },
        { store: 'locations' as const, records: locations },
        { store: 'settings' as const, records: settings },
        { store: 'maintenanceRecords' as const, records: maintenanceRecords }
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
        resolve(failure('Failed to parse the backup file. Make sure it is a valid JSON file.'));
      }
    };

    reader.onerror = () => resolve(failure('Failed to read the backup file.'));
    reader.readAsText(file);
  });
}

export async function restoreBackup(db: EvChargTrackerDb, backup: BackupFile): Promise<Result<void>> {
  if (backup.dbVersion > db.verno) {
    return failure(
      `Backup was created with a newer version of the app (v${backup.dbVersion}) and cannot be restored here (v${db.verno}). Please update the app first.`
    );
  }

  const getRecords = <T>(storeName: string): T[] => {
    const entry = backup.data.find((s) => s.store === storeName);
    return (entry?.records ?? []) as T[];
  };

  try {
    const tables = [db.vehicles, db.sessions, db.locations, db.settings, db.maintenanceRecords];

    await db.transaction('rw', tables, async () => {
      await Promise.all([
        db.vehicles.clear(),
        db.sessions.clear(),
        db.locations.clear(),
        db.settings.clear(),
        db.maintenanceRecords.clear()
      ]);

      await Promise.all([
        db.vehicles.bulkAdd(getRecords<VehicleRecord>('vehicles')),
        db.sessions.bulkAdd(getRecords<ChargingSessionRecord>('sessions')),
        db.locations.bulkAdd(getRecords<LocationRecord>('locations')),
        db.settings.bulkAdd(getRecords<SettingsRecord>('settings')),
        db.maintenanceRecords.bulkAdd(getRecords<MaintenanceRecord>('maintenanceRecords'))
      ]);
    });

    return success();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to restore backup data.';
    return failure(msg);
  }
}

export function isBackupOverdue(
  lastBackupAt: number | undefined,
  dismissedAt: number | undefined,
  interval: BackupReminderInterval,
  lastNotificationPushedAt: number | undefined
): boolean {
  // After the first notification, escalate to daily reminders until the user backs up
  const notYetBackedUpSinceNotification =
    !!lastNotificationPushedAt && (lastBackupAt ?? 0) < lastNotificationPushedAt;

  if (notYetBackedUpSinceNotification) {
    const referenceTime = Math.max(lastNotificationPushedAt, dismissedAt ?? 0);
    return Date.now() - referenceTime >= BACKUP_REMINDER_INTERVAL_MS['1d'];
  }

  const referenceTime = Math.max(lastBackupAt ?? 0, dismissedAt ?? 0);
  return Date.now() - referenceTime >= BACKUP_REMINDER_INTERVAL_MS[interval];
}

function validateBackup(parsed: unknown): Result<BackupFile> {
  const result = BackupFileSchema.safeParse(parsed);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const field = firstIssue.path.join('.') || 'root';

    return failure(`Invalid backup file at "${field}": ${firstIssue.message}`);
  }

  return success(result.data as BackupFile);
}
