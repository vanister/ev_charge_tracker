import { Button } from './Button';
import { Icon } from './Icon';
import type { IconName } from '../types/shared-types';

type EmptyStateProps = {
  icon?: IconName;
  label?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  buttonVariant?: 'primary' | 'secondary';
};

export function EmptyState({
  icon,
  label,
  title,
  message,
  actionLabel,
  onAction,
  buttonVariant = 'primary'
}: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      {label && <p className="text-body-secondary mb-4 text-sm">{label}</p>}
      <div className="bg-surface border-default rounded-lg border p-6 text-center">
        {icon && <Icon name={icon} size="lg" className="text-body-secondary mx-auto mb-4" />}
        <h3 className="text-body mb-2 text-lg font-medium">{title}</h3>
        <p className="text-body-secondary mb-4">{message}</p>
        {actionLabel && onAction && (
          <Button variant={buttonVariant} onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
