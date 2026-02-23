import type { SessionStats } from '../../hooks/useStats';
import { formatEnergy, formatCost, formatRate } from '../../utilities/formatUtils';
import { DashboardStatCard } from './DashboardStatCard';

type DashboardStatsProps = {
  stats: SessionStats;
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      <DashboardStatCard label="Total Energy" value={formatEnergy(stats.totalKwh)} icon="zap" />
      <DashboardStatCard label="Total Cost" value={formatCost(stats.totalCostCents)} icon="dollar-sign" />
      <DashboardStatCard label="Avg Rate" value={formatRate(stats.avgRatePerKwh)} icon="trending-up" />
      <DashboardStatCard label="Sessions" value={`${stats.sessionCount}`} icon="activity" />
    </div>
  );
}
