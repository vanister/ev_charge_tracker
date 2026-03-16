import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { useSettings } from '../../hooks/useSettings';
import { useBackupReminder } from '../../hooks/useBackupReminder';
import { Icon } from '../../components/Icon';
import { formatBackupReminderInterval } from '../../utilities/formatUtils';
import { BACKUP_REMINDER_INTERVALS } from '../../constants';
import type { BackupReminderInterval } from '../../constants';

export function BackupReminderSectionBody() {
  const { getSettings, updateSettings } = useSettings();
  const { needsReminder } = useBackupReminder(true);
  const [currentInterval, setCurrentInterval] = useState<BackupReminderInterval>('3d');
  const [lastBackupAt, setLastBackupAt] = useState<number | undefined>(undefined);

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

  const handleIntervalChange = async (interval: BackupReminderInterval) => {
    setCurrentInterval(interval);
    await updateSettings({ backupReminderInterval: interval });
  };

  const lastBackupDescription = lastBackupAt
    ? `Last backed up ${formatDistanceToNow(lastBackupAt, { addSuffix: true })}`
    : 'Never backed up';

  return (
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
      <p className="text-body-secondary text-xs">Remind me to back up every {formatBackupReminderInterval(currentInterval)}</p>
      <p className="text-body-secondary text-xs">{lastBackupDescription}</p>
    </div>
  );
}
