import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { useBackup } from '../../hooks/useBackup';
import { Button } from '../../components/Button';
import { RestoreBackupButton } from '../../components/RestoreBackupButton';
import { getDateGroupKey } from '../../utilities/dateUtils';

export function ExportRestoreSectionBody() {
  const { showToast } = useToast();
  const { exportBackup } = useBackup();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    const result = await exportBackup();

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

  const handleRestoreSuccess = () => {
    showToast({ message: 'Restore completed successfully.', variant: 'success', persistent: true });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-body">Export Backup</p>
          <p className="text-xs text-body-secondary">Download all your data as a JSON file</p>
        </div>
        <Button variant="secondary" onClick={handleExport} disabled={isExporting} className="w-32">
          {isExporting ? 'Exporting…' : 'Export'}
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-body">Restore from Backup</p>
          <p className="text-xs text-body-secondary">
            Replace all existing data from a backup file
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RestoreBackupButton
            label="Restore"
            disabled={isExporting}
            onSuccess={handleRestoreSuccess}
            className="w-32"
          />
        </div>
      </div>
    </>
  );
}
