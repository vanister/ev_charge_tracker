import { success, failure, type Result } from './resultUtils';

// Requires both Notification API and service worker — SW is needed for
// registration.showNotification() and notificationclick handling
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export function getNotificationPermission(): NotificationPermission | null {
  if (!isNotificationSupported()) {
    return null;
  }

  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<Result<NotificationPermission>> {
  if (!isNotificationSupported()) {
    return failure('Notifications are not supported on this device');
  }

  try {
    const permission = await Notification.requestPermission();
    return success(permission);
  } catch {
    return failure('Failed to request notification permission');
  }
}

export async function showBackupReminderNotification(): Promise<Result<void>> {
  if (!isNotificationSupported()) {
    return failure('Notifications are not supported');
  }

  if (Notification.permission !== 'granted') {
    return failure('Notification permission not granted');
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification('Backup Reminder', {
      body: 'Time to back up your data',
      icon: '/icons/icon-192x192.png',
      tag: 'backup-reminder',
      data: { url: '/settings#backup-restore' },
      requireInteraction: true
    });

    return success();
  } catch {
    return failure('Failed to show notification');
  }
}
