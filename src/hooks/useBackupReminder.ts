import { useEffect, useRef, useState, useCallback } from 'react';
import { useSettings } from './useSettings';
import { useToast } from './useToast';
import { isReminderOverdue } from '../utilities/backupReminderUtils';

export function useBackupReminder(dontToast = false) {
  const { getSettings, updateSettings } = useSettings();
  const { showToast } = useToast();
  const [needsReminder, setNeedsReminder] = useState(false);
  const toastShownRef = useRef(false);
  const dontToastRef = useRef(dontToast);
  dontToastRef.current = dontToast;

  // Check on app init — runs once on mount
  useEffect(() => {
    const check = async () => {
      const result = await getSettings();

      if (!result.success) {
        return;
      }

      const { backupReminderInterval = '3d', lastBackupAt, backupReminderDismissedAt } = result.data ?? {};
      const overdue = isReminderOverdue(lastBackupAt, backupReminderDismissedAt, backupReminderInterval);

      setNeedsReminder(overdue);

      if (!overdue || toastShownRef.current || dontToastRef.current) {
        return;
      }

      toastShownRef.current = true;
      showToast({
        message: 'Time to back up your data',
        variant: 'info',
        persistent: true,
        action: { label: 'View Backup', to: '/settings#export-restore' }
      });
    };

    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check when PWA is brought back to the foreground
  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      const result = await getSettings();

      if (!result.success) {
        return;
      }

      const { backupReminderInterval = '3d', lastBackupAt, backupReminderDismissedAt } = result.data ?? {};

      setNeedsReminder(isReminderOverdue(lastBackupAt, backupReminderDismissedAt, backupReminderInterval));
    };

    const onPageShow = async (event: PageTransitionEvent) => {
      if (!event.persisted) {
        return;
      }

      const result = await getSettings();

      if (!result.success) {
        return;
      }

      const { backupReminderInterval = '3d', lastBackupAt, backupReminderDismissedAt } = result.data ?? {};

      setNeedsReminder(isReminderOverdue(lastBackupAt, backupReminderDismissedAt, backupReminderInterval));
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', onPageShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissReminder = useCallback(async () => {
    setNeedsReminder(false);
    await updateSettings({ backupReminderDismissedAt: Date.now() });
  }, [updateSettings]);

  return { needsReminder, dismissReminder };
}
