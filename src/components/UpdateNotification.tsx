import { clsx } from 'clsx';

type UpdateNotificationProps = {
  show: boolean;
  onUpdate: () => void;
};

export function UpdateNotification({ show, onUpdate }: UpdateNotificationProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        'fixed bottom-4 left-4 right-4 z-50',
        'flex items-center justify-between',
        'bg-surface border border-default rounded-lg shadow-lg px-4 py-3',
        'max-w-md mx-auto'
      )}
    >
      <p className="text-sm text-body font-medium">A new version is available</p>
      <button
        onClick={onUpdate}
        aria-label="Reload application to apply new version"
        className="ml-4 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
      >
        Reload
      </button>
    </div>
  );
}
