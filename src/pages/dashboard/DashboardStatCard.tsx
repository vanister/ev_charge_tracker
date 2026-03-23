import { Icon } from '../../components/Icon';
import type { IconName } from '../../types/shared-types';

type DashboardStatCardProps = {
  label: string;
  value: string;
  icon: IconName;
  action?: { label: string; onClick: () => void };
};

export function DashboardStatCard({ label, value, icon, action }: DashboardStatCardProps) {
  return (
    <div className="bg-surface border-default rounded-lg border p-4">
      <Icon name={icon} size="sm" className="text-primary" />
      <p className="text-body-secondary mt-2 text-xs tracking-wide uppercase">{label}</p>
      <p className="text-body mt-1 text-xl font-semibold">{value}</p>
      {action && (
        <button type="button" className="text-primary mt-2 text-xs font-medium" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
