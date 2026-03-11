import { failure, success } from './resultUtils';
import type { Result } from './resultUtils';
import type { ChargingSession, EvChargTrackerDb, Location, Settings, Vehicle } from '../data/data-types';
import type { BackupFile } from '../pages/settings/settings-types';
import { BACKUP_FILE_VERSION } from '../data/constants';
import { BackupFileSchema } from '../data/backup-schema';

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
      fileVersion: BACKUP_FILE_VERSION,
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

export async function restoreBackup(db: EvChargTrackerDb, backup: BackupFile): Promise<Result<void>> {
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
      await Promise.all([db.vehicles.clear(), db.sessions.clear(), db.locations.clear(), db.settings.clear()]);
      await Promise.all([
        db.vehicles.bulkAdd(getRecords<Vehicle>('vehicles')),
        db.sessions.bulkAdd(getRecords<ChargingSession>('sessions')),
        db.locations.bulkAdd(getRecords<Location>('locations')),
        db.settings.bulkAdd(getRecords<Settings>('settings'))
      ]);
    });

    return success();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to restore backup data.';
    return failure(msg);
  }
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
