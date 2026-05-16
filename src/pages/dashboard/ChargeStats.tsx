import type { SessionStats, GasComparisonStats } from './dashboard-types';
import { formatEnergy, formatCost, formatCostPerMile, formatRate, formatGasPrice, formatMpg } from '../../utilities/formatUtils';
import { DashboardStatCard } from './DashboardStatCard';

type ChargeStatsProps = {
  stats: SessionStats;
  gasComparison: GasComparisonStats | null;
};

export function ChargeStats({ stats, gasComparison }: ChargeStatsProps) {
  const costPerMileSubtitle = stats.milesIncludeEstimates ? 'includes estimated miles' : undefined;
  const gasEquivSubtitle = gasComparison
    ? `avg ${formatGasPrice(gasComparison.avgGasPriceCents)} · ${formatMpg(gasComparison.comparisonMpg)}`
    : undefined;
  const savingsSubtitle = gasComparison
    ? (gasComparison.isGasMateriallyCheaper ? 'gas would be cheaper' : 'vs gas')
    : undefined;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <DashboardStatCard label="Cost" value={formatCost(stats.totalCostCents)} icon="dollar-sign" />
        {gasComparison ? (
          <DashboardStatCard label="Gas Equiv." value={formatCost(gasComparison.gasCostCents)} icon="dollar-sign" subtitle={gasEquivSubtitle} />
        ) : (
          <DashboardStatCard label="Gas Equiv." value="--" icon="dollar-sign" action={{ label: 'Configure gas comparison →', to: '/settings#gas-comparison' }} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DashboardStatCard label="Avg Rate" value={formatRate(stats.avgRatePerKwh)} icon="trending-up" />
        {gasComparison ? (
          <DashboardStatCard label="Savings" value={formatCost(gasComparison.savingsCents)} icon="trending-up" subtitle={savingsSubtitle} />
        ) : (
          <DashboardStatCard label="Savings" value="--" icon="trending-up" />
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DashboardStatCard label="Energy" value={formatEnergy(stats.totalKwh, 0)} icon="zap" />
        <DashboardStatCard label="Sessions" value={`${stats.sessionCount}`} icon="activity" />
      </div>
      <DashboardStatCard
        label="Cost / Mile"
        value={formatCostPerMile(stats.totalCostCents, stats.totalMiles)}
        icon="car"
        subtitle={costPerMileSubtitle}
      />
    </div>
  );
}
