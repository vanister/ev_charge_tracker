import { useState, type ReactNode } from 'react';
import { useToast } from '../../hooks/useToast';
import { useNavigationGuard } from '../../hooks/useNavigationGuard';
import { useSettings } from '../../hooks/useSettings';
import { ExportBackupButton } from '../../components/ExportBackupButton';
import { RestoreBackupButton } from '../../components/RestoreBackupButton';

export function ExportRestoreSectionBody() {
  const { showToast } = useToast();
  const { updateSettings } = useSettings();
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  useNavigationGuard({
    enabled: isExporting || isRestoring,
    message: () =>
      `A ${isExporting ? 'backup export' : 'restore'} is in progress. Leaving now may corrupt your data. Are you sure you want to leave?`
  });

  const handleExportSuccess = async () => {
    setIsExporting(false);
    await updateSettings({ lastBackupAt: Date.now() });
    showToast({ message: 'Backup exported successfully.', variant: 'success' });
  };

  const handleRestoreSuccess = () => {
    setIsRestoring(false);
    showToast({ message: 'Restore completed successfully.', variant: 'success' });
    location.reload();
  };

  const handleRestoreError = (error: string | null) => {
    setIsRestoring(false);
    setRestoreError(error);
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionRow title="Export Backup" description="Download all your data as a JSON file">
        <ExportBackupButton
          label="Export"
          disabled={isRestoring}
          onExportStart={() => setIsExporting(true)}
          onSuccess={handleExportSuccess}
          onError={(error) => {
            setIsExporting(false);
            showToast({ message: error, variant: 'error', persistent: true });
          }}
          className="w-28 shrink-0"
        />
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
  description?: string;
  children?: ReactNode;
};

function SectionRow({ title, description, children }: SectionRowProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="mr-4">
        <p className="text-body text-sm font-medium">{title}</p>
        {description && <p className="text-body-secondary text-xs">{description}</p>}
      </div>
      {children}
    </div>
  );
}
