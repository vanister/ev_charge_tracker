import type { GasComparisonStats } from './dashboard-types';
import { formatCost, formatGasPrice } from '../../utilities/formatUtils';
import { isGasMateriallyCheaper } from '../../helpers/gasComparisonHelpers';
import { DashboardStatCard } from './DashboardStatCard';

type GasComparisonProps = {
  gasComparison: GasComparisonStats | null;
};

export function GasComparison({ gasComparison }: GasComparisonProps) {
  if (!gasComparison) {
    return (
      <DashboardStatCard
        label="Gas Savings"
        value="--"
        icon="trending-up"
        action={{ label: 'Configure gas comparison →', to: '/settings#gas-comparison' }}
      />
    );
  }

  const savingsSubtitle = isGasMateriallyCheaper(gasComparison) ? 'gas would be cheaper' : 'vs gas';
  const gasEquivSubtitle = `avg ${formatGasPrice(gasComparison.avgGasPriceCents)}`;

  return (
    <div className="grid grid-cols-2 gap-3">
      <DashboardStatCard
        label="Gas Equiv."
        value={formatCost(gasComparison.gasCostCents)}
        icon="dollar-sign"
        subtitle={gasEquivSubtitle}
      />
      <DashboardStatCard
        label="Savings"
        value={formatCost(gasComparison.savingsCents)}
        icon="trending-up"
        subtitle={savingsSubtitle}
      />
    </div>
  );
}
