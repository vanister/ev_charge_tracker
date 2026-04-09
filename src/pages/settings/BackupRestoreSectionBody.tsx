import { useState, useEffect, type ReactNode } from 'react';
import { useToast } from '../../hooks/useToast';
import { useNavigationGuard } from '../../hooks/useNavigationGuard';
import { useSettings } from '../../hooks/useSettings';
import { useBackupReminder } from '../../hooks/useBackupReminder';
import { ExportBackupButton } from '../../components/ExportBackupButton';
import { RestoreBackupButton } from '../../components/RestoreBackupButton';
import { ButtonRow } from '../../components/ButtonRow';
import { Icon } from '../../components/Icon';
import { formatDistanceToNow } from '../../utilities/dateUtils';
import { formatBackupReminderInterval } from '../../utilities/formatUtils';
import { BACKUP_REMINDER_INTERVALS, type BackupReminderInterval } from '../../constants';
import { NotificationPermissionRow } from './NotificationPermissionRow';
import { SettingsContentDivider } from './SettingsContentDivider';

export function BackupRestoreSectionBody() {
  const { showToast } = useToast();
  const { getSettings, updateSettings } = useSettings();
  const { needsReminder } = useBackupReminder(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [currentInterval, setCurrentInterval] = useState<BackupReminderInterval>('3d');
  const [lastBackupAt, setLastBackupAt] = useState<number | undefined>(undefined);

  useNavigationGuard({
    enabled: isExporting || isRestoring,
    message: () =>
      `A ${isExporting ? 'backup export' : 'restore'} is in progress. Leaving now may corrupt your data. Are you sure you want to leave?`
  });

  useEffect(() => {
    const load = async () => {
      const result = await getSettings();

      if (result.success && result.data) {
        setCurrentInterval(result.data.backupReminderInterval ?? '3d');
        setLastBackupAt(result.data.lastBackupAt);
      }
    };

    load();
  }, [getSettings]);

  const handleExportSuccess = async () => {
    setIsExporting(false);
    await updateSettings({ lastBackupAt: Date.now() });
    setLastBackupAt(Date.now());
    showToast({ message: 'Backup exported successfully.', variant: 'success' });
  };

  const handleRestoreSuccess = async () => {
    setIsRestoring(false);
    await updateSettings({ lastBackupAt: Date.now() });
    showToast({ message: 'Restore completed successfully.', variant: 'success' });
    location.replace(location.pathname);
  };

  const handleRestoreError = (error: string | null) => {
    setIsRestoring(false);
    setRestoreError(error);
  };

  const handleIntervalChange = async (interval: BackupReminderInterval) => {
    setCurrentInterval(interval);
    await updateSettings({ backupReminderInterval: interval });
  };

  const lastBackupDescription = lastBackupAt
    ? `Last backed up ${formatDistanceToNow(lastBackupAt)}`
    : 'Never backed up';

  return (
    <div className="flex flex-col gap-4">
      <SectionRow title="Backup" description="Download all your data as a JSON file">
        <ExportBackupButton
          label="Backup"
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

      <SettingsContentDivider />

      <div className="flex flex-col gap-2">
        <p className="text-body text-sm font-medium">Reminder Frequency</p>
        {needsReminder && (
          <div className="bg-primary/10 flex items-center gap-2 rounded-lg p-3">
            <Icon name="bell" size="sm" className="text-primary shrink-0" />
            <p className="text-body text-xs">
              It's been a while since your last backup. Export your data to keep it safe.
            </p>
          </div>
        )}
        <ButtonRow
          options={BACKUP_REMINDER_INTERVALS}
          value={currentInterval}
          onChange={(v) => handleIntervalChange(v as BackupReminderInterval)}
        />
        <div className="mt-3 flex flex-col gap-2">
          <NotificationPermissionRow />
          <p className="text-body-secondary text-xs">
            Remind me to back up every {formatBackupReminderInterval(currentInterval)}
          </p>
          <p className="text-body-secondary text-xs italic">{lastBackupDescription}</p>
        </div>
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
