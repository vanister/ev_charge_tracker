import clsx from 'clsx';
import { Link } from 'react-router';
import { Icon } from './Icon';
import type { Toast } from '../types/toast-types';
import type { IconName } from '../types/shared-types';

type ToastProps = Toast & {
  onDismiss: (id: string) => void;
};

type VariantConfig = {
  icon: IconName;
  iconClass: string;
};

const variantConfig: Record<Toast['variant'], VariantConfig> = {
  success: { icon: 'check-circle', iconClass: 'text-secondary' },
  error: { icon: 'x-circle', iconClass: 'text-red-500' },
  warning: { icon: 'alert-triangle', iconClass: 'text-accent' },
  info: { icon: 'info', iconClass: 'text-primary' }
};

export function Toast({ id, message, variant, action, exiting, onDismiss }: ToastProps) {
  const { icon, iconClass } = variantConfig[variant];

  const handleActionClick = () => {
    onDismiss(id);
    action?.onClick?.();
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        'bg-surface border-default flex items-center gap-3 rounded-lg border px-4 py-6 shadow-lg',
        exiting ? 'animate-toast-out' : 'animate-toast-in'
      )}
    >
      <Icon name={icon} size="sm" className={clsx(iconClass, 'shrink-0')} />
      <p className="text-body flex-1 text-sm font-medium">{message}</p>
      {action &&
        (action.to ? (
          <Link
            to={action.to}
            onClick={() => onDismiss(id)}
            className="bg-primary hover:bg-primary-hover shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleActionClick}
            className="bg-primary hover:bg-primary-hover shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors"
          >
            {action.label}
          </button>
        ))}
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="text-muted hover:text-body shrink-0 transition-colors"
      >
        <Icon name="x" size="sm" />
      </button>
    </div>
  );
}
