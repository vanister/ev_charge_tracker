import type { SessionStats } from './dashboard-types';
import type { SessionWithMetadata } from '../../helpers/sessionHelpers';
import type { ChartData } from './chart-types';
import { DashboardStats } from './DashboardStats';
import { ChargeSessionsCharts } from './ChargeSessionsCharts';
import { DashboardRecentSessions } from './DashboardRecentSessions';

type DashboardContentProps = {
  stats: SessionStats;
  recentSessions: SessionWithMetadata[];
  chartData: ChartData;
};

export function DashboardContent({ stats, recentSessions, chartData }: DashboardContentProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <DashboardStats stats={stats} />
      <ChargeSessionsCharts data={chartData} stats={stats} />
      <DashboardRecentSessions sessions={recentSessions} />
    </div>
  );
}
