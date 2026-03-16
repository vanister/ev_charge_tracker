import { useEffect, useRef, useState, useCallback } from 'react';
import { useSettings } from './useSettings';
import { useToast } from './useToast';
import { isBackupOverdue } from '../utilities/backupUtils';

export function useBackupReminder() {
  const { getSettings, updateSettings } = useSettings();
  const { showToast } = useToast();
  const [needsReminder, setNeedsReminder] = useState(false);
  const toastShownRef = useRef(false);

  // Check on app init — runs once on mount
  useEffect(() => {
    const check = async () => {
      const result = await getSettings();

      if (!result.success) {
        return;
      }

      const { backupReminderInterval = '3d', lastBackupAt, backupReminderDismissedAt } = result.data ?? {};
      const overdue = isBackupOverdue(lastBackupAt, backupReminderDismissedAt, backupReminderInterval);

      setNeedsReminder(overdue);

      if (!overdue || toastShownRef.current) {
        return;
      }

      toastShownRef.current = true;
      showToast({
        message: 'Time to back up your data',
        persistent: true,
        action: { label: 'View Backup', to: '/settings#export-restore' }
      });
    };

    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check when PWA is brought back to the foreground
  useEffect(() => {
    const doBackupReminderCheck = async () => {
      const result = await getSettings();

      if (!result.success) {
        return;
      }

      const { backupReminderInterval = '3d', lastBackupAt, backupReminderDismissedAt } = result.data ?? {};

      setNeedsReminder(isBackupOverdue(lastBackupAt, backupReminderDismissedAt, backupReminderInterval));
    };

    const onVisible = async () => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      await doBackupReminderCheck();
    };

    const onPageShow = async (event: PageTransitionEvent) => {
      if (!event.persisted) {
        return;
      }

      await doBackupReminderCheck();
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [getSettings]);

  const dismissReminder = useCallback(async () => {
    setNeedsReminder(false);
    await updateSettings({ backupReminderDismissedAt: Date.now() });
  }, [updateSettings]);

  return { needsReminder, dismissReminder };
}
