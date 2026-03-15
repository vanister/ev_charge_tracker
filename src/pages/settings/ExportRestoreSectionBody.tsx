import { useState, useEffect, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '../../hooks/useToast';
import { useNavigationGuard } from '../../hooks/useNavigationGuard';
import { useSettings } from '../../hooks/useSettings';
import { useBackupReminder } from '../../hooks/useBackupReminder';
import { ExportBackupButton } from '../../components/ExportBackupButton';
import { RestoreBackupButton } from '../../components/RestoreBackupButton';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { BACKUP_REMINDER_INTERVALS } from '../../constants';
import type { BackupReminderInterval } from '../../constants';
import type { Settings } from '../../data/data-types';

export function ExportRestoreSectionBody() {
  const { showToast } = useToast();
  const { getSettings, updateSettings } = useSettings();
  const { needsReminder, dismissReminder } = useBackupReminder(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [settingsData, setSettingsData] = useState<Settings | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await getSettings();

      if (result.success && result.data) {
        setSettingsData(result.data);
      }
    };

    load();
  }, [getSettings]);

  useNavigationGuard({
    enabled: isExporting || isRestoring,
    message: () =>
      `A ${isExporting ? 'backup export' : 'restore'} is in progress. Leaving now may corrupt your data. Are you sure you want to leave?`
  });

  const handleExportSuccess = async () => {
    const now = Date.now();
    setIsExporting(false);
    setSettingsData((prev) => (prev ? { ...prev, lastBackupAt: now } : prev));
    await updateSettings({ lastBackupAt: now });
    showToast({ message: 'Backup exported successfully.' });
  };

  const handleRestoreSuccess = () => {
    setIsRestoring(false);
    showToast({ message: 'Restore completed successfully.' });
    location.reload();
  };

  const handleRestoreError = (error: string | null) => {
    setIsRestoring(false);
    setRestoreError(error);
  };

  const handleIntervalChange = async (interval: BackupReminderInterval) => {
    setSettingsData((prev) => (prev ? { ...prev, backupReminderInterval: interval } : prev));
    await updateSettings({ backupReminderInterval: interval });
  };

  const handleDismissReminder = async () => {
    await dismissReminder();
  };

  const currentInterval = settingsData?.backupReminderInterval ?? '3d';
  const lastBackupAt = settingsData?.lastBackupAt;

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

      <div className="border-default border-t pt-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-body text-sm font-medium">Backup Reminder</p>
            <p className="text-body-secondary text-xs">
              {lastBackupAt
                ? `Last backed up ${formatDistanceToNow(lastBackupAt, { addSuffix: true })}`
                : 'Never backed up'}
            </p>
          </div>
          {needsReminder && (
            <button
              onClick={handleDismissReminder}
              className="text-body-secondary hover:text-body flex items-center gap-1 text-xs transition-colors"
            >
              <Icon name="x" size="xs" />
              Dismiss
            </button>
          )}
        </div>

        {needsReminder && (
          <div className="bg-primary/10 mb-3 flex items-center gap-2 rounded-lg p-3">
            <Icon name="bell" size="sm" className="text-primary shrink-0" />
            <p className="text-body text-xs">
              It's been a while since your last backup. Export your data to keep it safe.
            </p>
          </div>
        )}

        <div className="flex gap-1.5">
          {BACKUP_REMINDER_INTERVALS.map((interval) => (
            <button
              key={interval}
              onClick={() => handleIntervalChange(interval)}
              className={clsx('flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors', {
                'bg-primary text-white': currentInterval === interval,
                'bg-surface text-body-secondary hover:bg-primary/10': currentInterval !== interval
              })}
            >
              {interval}
            </button>
          ))}
        </div>
        <p className="text-body-secondary mt-1.5 text-xs">Remind me to back up every {currentInterval}</p>
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
