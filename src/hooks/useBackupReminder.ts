import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from './useSettings';
import { useToast } from './useToast';
import { BACKUP_REMINDER_INTERVAL_MS } from '../constants';
import type { BackupReminderInterval } from '../constants';

function isReminderOverdue(lastBackupAt: number | undefined, dismissedAt: number | undefined, interval: BackupReminderInterval): boolean {
  const referenceTime = Math.max(lastBackupAt ?? 0, dismissedAt ?? 0);
  return (Date.now() - referenceTime) >= BACKUP_REMINDER_INTERVAL_MS[interval];
}

export function useBackupReminder(dontToast = false) {
  const { getSettings, updateSettings } = useSettings();
  const { showToast } = useToast();
  const [needsReminder, setNeedsReminder] = useState(false);
  const toastShownRef = useRef(false);

  const checkReminder = useCallback(async () => {
    const result = await getSettings();

    if (!result.success || !result.data) {
      return;
    }

    const { backupReminderInterval = '3d', lastBackupAt, backupReminderDismissedAt } = result.data;
    const overdue = isReminderOverdue(lastBackupAt, backupReminderDismissedAt, backupReminderInterval);

    setNeedsReminder(overdue);

    if (!overdue || toastShownRef.current || dontToast) {
      return;
    }

    toastShownRef.current = true;
    showToast({
      message: 'Time to back up your data',
      variant: 'info',
      persistent: true,
      action: { label: 'View Backup', to: '/settings#export-restore' }
    });
  }, [getSettings, showToast, dontToast]);

  // Check on initial app load
  useEffect(() => {
    checkReminder();
  }, [checkReminder]);

  // Re-check when the PWA is brought back to the foreground
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        checkReminder();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      // persisted=true means the page was restored from bfcache (back/forward nav)
      if (event.persisted) {
        checkReminder();
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [checkReminder]);

  const dismissReminder = useCallback(async () => {
    setNeedsReminder(false);
    await updateSettings({ backupReminderDismissedAt: Date.now() });
  }, [updateSettings]);

  return { needsReminder, dismissReminder };
}
