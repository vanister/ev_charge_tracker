import { Icon } from '../../components/Icon';
import type { IconName } from '../../types/shared-types';

type DashboardStatCardProps = {
  label: string;
  value: string;
  icon: IconName;
};

export function DashboardStatCard({ label, value, icon }: DashboardStatCardProps) {
  return (
    <div className="p-4 bg-surface border border-default rounded-lg">
      <Icon name={icon} size="sm" className="text-primary" />
      <p className="text-xs text-body-secondary uppercase tracking-wide mt-2">{label}</p>
      <p className="text-xl font-semibold text-body mt-1">{value}</p>
    </div>
  );
}
