import { useState, type ReactNode } from 'react';
import { useToast } from '../../hooks/useToast';
import { useBackup } from '../../hooks/useBackup';
import { useNavigationGuard } from '../../hooks/useNavigationGuard';
import { Button } from '../../components/Button';
import { RestoreBackupButton } from '../../components/RestoreBackupButton';
import { getDateGroupKey } from '../../utilities/dateUtils';

export function ExportRestoreSectionBody() {
  const { showToast } = useToast();
  const { exportBackup } = useBackup();
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  useNavigationGuard({
    enabled: isExporting || isRestoring,
    message: () =>
      `A ${isExporting ? 'backup export' : 'restore'} is in progress. Leaving now may corrupt your data. Are you sure you want to leave?`
  });

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
    setIsRestoring(false);
    showToast({ message: 'Restore completed successfully.', variant: 'success' });
  };

  const handleRestoreError = (error: string | null) => {
    setIsRestoring(false);
    setRestoreError(error);
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionRow title="Export Backup" description="Download all your data as a JSON file">
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={isExporting || isRestoring}
          className="w-28 shrink-0"
        >
          {isExporting ? 'Exporting…' : 'Export'}
        </Button>
      </SectionRow>

      <div className="flex flex-col gap-1">
        <SectionRow title="Restore from Backup" description="Replace all existing data from a backup file">
          <RestoreBackupButton
            label="Restore"
            disabled={isExporting || isRestoring}
            onRestoreStart={() => setIsRestoring(true)}
            onSuccess={handleRestoreSuccess}
            onError={handleRestoreError}
            className="w-28 shrink-0"
          />
        </SectionRow>
        {restoreError && <p className="text-sm text-red-600 dark:text-red-400">{restoreError}</p>}
      </div>
    </div>
  );
}

type SectionRowProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function SectionRow({ title, description, children }: SectionRowProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="mr-4">
        <p className="text-body text-sm font-medium">{title}</p>
        <p className="text-body-secondary text-xs">{description}</p>
      </div>
      {children}
    </div>
  );
}
