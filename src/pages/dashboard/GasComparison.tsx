import type { GasComparisonStats } from './dashboard-types';
import { formatCost } from '../../utilities/formatUtils';
import { DashboardStatCard } from './DashboardStatCard';

type GasComparisonProps = {
  gasComparison: GasComparisonStats | null;
};

export function GasComparison({ gasComparison }: GasComparisonProps) {
  if (!gasComparison) {
    return (
      <DashboardStatCard
        label="Gas Savings"
        icon="trending-up"
        action={{ label: 'Configure gas comparison →', to: '/settings#gas-comparison' }}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <DashboardStatCard label="Gas Equiv." value={formatCost(gasComparison.gasCostCents)} icon="dollar-sign" />
      <DashboardStatCard
        label="Savings"
        value={formatCost(gasComparison.savingsCents)}
        icon="trending-up"
        subtitle={gasComparison.savingsCents >= 0 ? 'vs gas' : 'gas would be cheaper'}
      />
    </div>
  );
}
