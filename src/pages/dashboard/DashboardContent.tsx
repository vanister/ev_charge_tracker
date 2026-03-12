import type { SessionStats } from './dashboard-types';
import type { SessionWithMetadata } from '../../helpers/sessionHelpers';
import type { ChartData } from './chart-types';
import { DashboardStats } from './DashboardStats';
import { ChargeSessionsChart } from './ChargeSessionsChart';
import { KwhByLocation } from './KwhByLocation';
import { DashboardRecentSessions } from './DashboardRecentSessions';

type DashboardContentProps = {
  stats: SessionStats;
  recentSessions: SessionWithMetadata[];
  chartData: ChartData;
};

export function DashboardContent({ stats, recentSessions, chartData }: DashboardContentProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <DashboardStats stats={stats} />
      <ChargeSessionsChart data={chartData} />
      <KwhByLocation stats={stats} />
      <DashboardRecentSessions sessions={recentSessions} />
    </div>
  );
}
