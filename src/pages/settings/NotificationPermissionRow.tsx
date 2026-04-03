import { useNotificationPermission } from '../../hooks/useNotificationPermission';
import { Icon } from '../../components/Icon';

export function NotificationPermissionRow() {
  const { permission, requestPermission, isSupported } = useNotificationPermission();

  if (!isSupported) {
    return null;
  }

  if (permission === 'granted') {
    return (
      <div className="flex items-center gap-1.5">
        <Icon name="check-circle" size="sm" className="text-primary" />
        <p className="text-body-secondary text-xs">Push notifications enabled</p>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <p className="text-body-secondary text-xs">
        Notifications blocked — enable in your device settings
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={requestPermission}
      className="text-primary text-xs font-medium underline underline-offset-2"
    >
      Enable push notifications
    </button>
  );
}
