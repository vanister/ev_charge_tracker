import type { SessionStats } from './dashboard-types';
import { formatEnergy, formatCost, formatRate } from '../../utilities/formatUtils';
import { DashboardStatCard } from './DashboardStatCard';

type ChargeStatsProps = {
  stats: SessionStats;
};

export function ChargeStats({ stats }: ChargeStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <DashboardStatCard label="Energy" value={formatEnergy(stats.totalKwh, 0)} icon="zap" />
      <DashboardStatCard label="Cost" value={formatCost(stats.totalCostCents)} icon="dollar-sign" />
      <DashboardStatCard label="Avg Rate" value={formatRate(stats.avgRatePerKwh)} icon="trending-up" />
      <DashboardStatCard label="Sessions" value={`${stats.sessionCount}`} icon="activity" />
    </div>
  );
}
