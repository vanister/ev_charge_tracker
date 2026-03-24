import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../types/shared-types';

type DashboardStatCardProps = {
  label: string;
  value: string;
  icon: IconName;
  action?: { label: string; to: string };
};

export function DashboardStatCard({ label, value, icon, action }: DashboardStatCardProps) {
  return (
    <div className="bg-surface border-default rounded-lg border p-4">
      <div className="flex items-center gap-1.5">
        <Icon name={icon} size="sm" className="text-primary" />
        <p className="text-body-secondary text-xs tracking-wide uppercase">{label}</p>
      </div>
      <p className="text-body mt-1 text-xl font-semibold">{value}</p>
      {action && (
        <Link to={action.to} className="text-primary mt-2 text-xs font-medium">
          {action.label}
        </Link>
      )}
    </div>
  );
}
