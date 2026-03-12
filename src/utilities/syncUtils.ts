import { exportBackup, restoreBackup } from './backupUtils';
import { failure, success } from './resultUtils';
import type { Result } from './resultUtils';
import type { EvChargTrackerDb } from '../data/data-types';
import type { BackupFile } from '../pages/settings/settings-types';
import { SyncFileSchema } from '../data/sync-schema';
import type { SyncFile } from '../data/sync-schema';
import { SYNC_FILE_VERSION } from '../data/constants';

export function buildSyncFile(backup: BackupFile, deviceId: string): SyncFile {
  return { ...backup, fileVersion: SYNC_FILE_VERSION, deviceId };
}

export function parseSyncFile(raw: unknown): Result<SyncFile> {
  const result = SyncFileSchema.safeParse(raw);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const field = firstIssue.path.join('.') || 'root';
    return failure(`Invalid sync file at "${field}": ${firstIssue.message}`);
  }

  return success(result.data);
}

export async function exportSyncFile(db: EvChargTrackerDb, deviceId: string): Promise<Result<SyncFile>> {
  const result = await exportBackup(db);

  if (!result.success) {
    return result;
  }

  return success(buildSyncFile(result.data, deviceId));
}

export async function importSyncFile(db: EvChargTrackerDb, syncFile: SyncFile): Promise<Result<void>> {
  return restoreBackup(db, syncFile);
}
