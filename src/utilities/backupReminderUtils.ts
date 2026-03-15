import { BACKUP_REMINDER_INTERVAL_MS } from '../constants';
import type { BackupReminderInterval } from '../constants';

export function isReminderOverdue(
  lastBackupAt: number | undefined,
  dismissedAt: number | undefined,
  interval: BackupReminderInterval
): boolean {
  const referenceTime = Math.max(lastBackupAt ?? 0, dismissedAt ?? 0);
  return Date.now() - referenceTime >= BACKUP_REMINDER_INTERVAL_MS[interval];
}
