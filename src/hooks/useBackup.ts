import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import { useUserPreferences } from './useUserPreferences';
import {
  exportBackup as exportBackupUtil,
  readBackupFile as readBackupFileUtil,
  restoreBackup as restoreBackupUtil
} from '../utilities/backupUtils';
import type { BackupFile } from '../pages/settings/settings-types';

export function useBackup() {
  const { db } = useDatabase();
  const { preferences } = useUserPreferences();

  const exportBackup = useCallback(
    () => exportBackupUtil(db, { recentSessionsLimit: preferences.recentSessionsLimit }),
    [db, preferences.recentSessionsLimit]
  );

  const readBackupFile = useCallback((file: File) => readBackupFileUtil(file), []);

  const restoreBackup = useCallback((backup: BackupFile) => restoreBackupUtil(db, backup), [db]);

  return { exportBackup, readBackupFile, restoreBackup };
}
