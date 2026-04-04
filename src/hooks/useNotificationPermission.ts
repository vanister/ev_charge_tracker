import { useState, useCallback, useEffect } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission
} from '../utilities/notificationUtils';

export function useNotificationPermission() {
  const isSupported = isNotificationSupported();
  const [permission, setPermission] = useState<NotificationPermission | null>(
    getNotificationPermission
  );

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    let unmounted = false;
    let status: PermissionStatus | null = null;
    const onChange = () => setPermission(Notification.permission);

    navigator.permissions?.query({ name: 'notifications' }).then((result) => {
      if (unmounted) {
        return;
      }

      status = result;
      status.addEventListener('change', onChange);
    });

    return () => {
      unmounted = true;
      status?.removeEventListener('change', onChange);
    };
  }, [isSupported]);

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();

    if (result.success) {
      setPermission(result.data);
    }

    return result;
  }, []);

  return { permission, requestPermission, isSupported };
}
