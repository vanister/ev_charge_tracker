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

export function Toast({ id, message, variant, action, onDismiss }: ToastProps) {
  const { icon, iconClass } = variantConfig[variant];

  const handleActionClick = () => {
    onDismiss(id);
    action?.onClick?.();
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="bg-surface border border-default rounded-lg shadow-lg px-4 py-6 flex items-center gap-3"
    >
      <Icon name={icon} size="sm" className={clsx(iconClass, 'shrink-0')} />
      <p className="text-sm text-body font-medium flex-1">{message}</p>
      {action && (
        action.to ? (
          <Link
            to={action.to}
            onClick={() => onDismiss(id)}
            className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shrink-0"
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleActionClick}
            className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shrink-0"
          >
            {action.label}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="text-muted hover:text-body transition-colors shrink-0"
      >
        <Icon name="x" size="sm" />
      </button>
    </div>
  );
}
