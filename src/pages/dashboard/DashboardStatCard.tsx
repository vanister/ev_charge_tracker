import { Icon } from '../../components/Icon';
import type { IconName } from '../../types/shared-types';

type DashboardStatCardProps = {
  label: string;
  value: string;
  icon: IconName;
};

export function DashboardStatCard({ label, value, icon }: DashboardStatCardProps) {
  return (
    <div className="bg-surface border-default rounded-lg border p-4">
      <div className="flex items-center gap-1.5">
        <Icon name={icon} size="sm" className="text-primary" />
        <p className="text-body-secondary text-xs tracking-wide uppercase">{label}</p>
      </div>
      <p className="text-body mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
