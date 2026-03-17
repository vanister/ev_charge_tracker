import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useBackupReminder } from '../../hooks/useBackupReminder';
import { ButtonRow } from '../../components/ButtonRow';
import { Icon } from '../../components/Icon';
import { formatDistanceToNow } from '../../utilities/dateUtils';
import { formatBackupReminderInterval } from '../../utilities/formatUtils';
import { BACKUP_REMINDER_INTERVALS, type BackupReminderInterval } from '../../constants';

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
    ? `Last backed up ${formatDistanceToNow(lastBackupAt)}`
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
      <ButtonRow
        options={BACKUP_REMINDER_INTERVALS}
        value={currentInterval}
        onChange={(v) => handleIntervalChange(v as BackupReminderInterval)}
      />
      <p className="text-body-secondary text-xs">
        Remind me to back up every {formatBackupReminderInterval(currentInterval)}
      </p>
      <p className="text-body-secondary text-xs italic">{lastBackupDescription}</p>
    </div>
  );
}
