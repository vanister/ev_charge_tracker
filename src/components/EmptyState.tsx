import { Button } from './Button';
import { Icon } from './Icon';
import type { IconName } from './Icon';

type EmptyStateProps = {
  icon?: IconName;
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
  buttonVariant?: 'primary' | 'secondary';
};

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  buttonVariant = 'primary'
}: EmptyStateProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="p-6 bg-surface border border-default rounded-lg text-center">
        {icon && <Icon name={icon} size="lg" className="mx-auto mb-4 text-body-secondary" />}
        <h3 className="text-lg font-medium text-body mb-2">{title}</h3>
        <p className="text-body-secondary mb-4">{message}</p>
        <Button variant={buttonVariant} onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
