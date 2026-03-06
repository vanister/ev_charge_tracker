import { useRef, useState } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/Button';
import { exportBackup, readBackupFile, restoreBackup } from './backupHelpers';
import { getDateGroupKey } from '../../utilities/dateUtils';

export function ExportRestoreSectionBody() {
  const { db } = useDatabase();
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsExporting(true);

    const result = await exportBackup(db);

    if (!result.success) {
      showToast({ message: `Export failed: ${result.error}`, variant: 'error', persistent: true });
      setIsExporting(false);
      return;
    }

    const json = JSON.stringify(result.data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const date = getDateGroupKey(Date.now());
    const a = document.createElement('a');
    a.href = url;
    a.download = `${date}-ev-charge-tracker-backup.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast({ message: 'Backup exported successfully.', variant: 'success' });
    setIsExporting(false);
  };

  const handleRestoreClick = () => {
    setRestoreError(null);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Reset input so the same file can be re-selected after cancelling
    e.target.value = '';

    const readResult = await readBackupFile(file);
    if (!readResult.success) {
      setRestoreError(readResult.error);
      return;
    }

    const backup = readResult.data;

    if (backup.version !== db.verno) {
      const msg =
        `Backup version (${backup.version}) does not match ` +
        `the app's database version (${db.verno}). Restore is not possible.`;
      setRestoreError(msg);
      return;
    }

    const confirmed = window.confirm(
      'This will permanently overwrite all existing vehicles, sessions, locations, and ' +
      'settings with the contents of the backup file. This cannot be undone. Continue?'
    );
    if (!confirmed) {
      return;
    }

    setIsRestoring(true);

    const restoreResult = await restoreBackup(db, backup);

    if (!restoreResult.success) {
      setIsRestoring(false);
      showToast({
        message: `Restore failed: ${restoreResult.error}`,
        variant: 'error',
        persistent: true
      });
      return;
    }

    setIsRestoring(false);
    showToast({ message: 'Restore completed successfully.', variant: 'success', persistent: true });
  };

  const anyBusy = isExporting || isRestoring;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-body">Export Backup</p>
          <p className="text-xs text-body-secondary">Download all your data as a JSON file</p>
        </div>
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={anyBusy}
        >
          {isExporting ? 'Exporting…' : 'Export'}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-body">Restore from Backup</p>
          <p className="text-xs text-body-secondary">
            Replace all existing data from a backup file
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={handleRestoreClick}
          disabled={anyBusy}
        >
          {isRestoring ? 'Restoring…' : 'Restore'}
        </Button>
      </div>

      {restoreError && (
        <p className="text-sm text-red-600 dark:text-red-400">{restoreError}</p>
      )}
    </>
  );
}
