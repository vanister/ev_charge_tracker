import { useEffect, useRef, useState, useCallback } from 'react';
import { useSettings } from './useSettings';
import { useToast } from './useToast';
import { isBackupOverdue } from '../utilities/backupUtils';
import {
  isNotificationSupported,
  showBackupReminderNotification
} from '../utilities/notificationUtils';

export function useBackupReminder(dontShow = false) {
  const { getSettings, updateSettings } = useSettings();
  const { showToast } = useToast();
  const [needsReminder, setNeedsReminder] = useState(false);
  const reminderShownRef = useRef(false);

  const showBackupReminderToast = useCallback(() => {
    showToast({
      message: 'Time to back up your data',
      persistent: true,
      action: { label: 'View Backup', to: '/settings#backup-restore' }
    });
  }, [showToast]);

  const doBackupReminderCheck = useCallback(async () => {
    const result = await getSettings();

    if (!result.success) {
      return;
    }

    const { backupReminderInterval = '3d', lastBackupAt, backupReminderDismissedAt } = result.data ?? {};
    const overdue = isBackupOverdue(lastBackupAt, backupReminderDismissedAt, backupReminderInterval);

    setNeedsReminder(overdue);

    if (overdue && !dontShow && !reminderShownRef.current) {
      reminderShownRef.current = true;

      const useOsNotification =
        isNotificationSupported() && Notification.permission === 'granted';

      if (useOsNotification) {
        const notifResult = await showBackupReminderNotification();

        // Fall back to toast if notification failed
        if (!notifResult.success) {
          showBackupReminderToast();
        }
      } else {
        showBackupReminderToast();
      }
    }
  }, [dontShow, getSettings, showBackupReminderToast]);

  // Check on app init — runs once on mount
  useEffect(() => {
    if (dontShow) {
      return;
    }

    doBackupReminderCheck();
    // doBackupReminderCheck intentionally omitted — we only want this to fire once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dontShow]);

  // Re-check when PWA is brought back to the foreground
  useEffect(() => {
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
  }, [doBackupReminderCheck]);

  const dismissReminder = useCallback(async () => {
    setNeedsReminder(false);
    await updateSettings({ backupReminderDismissedAt: Date.now() });
  }, [updateSettings]);

  return { needsReminder, dismissReminder };
}
