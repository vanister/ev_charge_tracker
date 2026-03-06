import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import {
  exportBackup as exportBackupUtil,
  readBackupFile as readBackupFileUtil,
  restoreBackup as restoreBackupUtil
} from '../utilities/backupUtils';
import type { BackupFile } from '../utilities/backupUtils';

export function useBackup() {
  const { db } = useDatabase();

  const exportBackup = useCallback(() => exportBackupUtil(db), [db]);

  const readBackupFile = (file: File) => readBackupFileUtil(file);

  const restoreBackup = useCallback(
    (backup: BackupFile) => restoreBackupUtil(db, backup),
    [db]
  );

  return { exportBackup, readBackupFile, restoreBackup };
}
