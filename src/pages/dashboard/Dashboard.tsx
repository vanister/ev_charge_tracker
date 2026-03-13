import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePageConfig } from '../../hooks/usePageConfig';
import { useDashboardData } from './useDashboardData';
import { EmptyState } from '../../components/EmptyState';
import { Section } from '../../components/Section';
import { ChargeStats } from './ChargeStats';
import { ChargeSessionsCharts } from './ChargeSessionsCharts';
import { DashboardRecentSessions } from './DashboardRecentSessions';

export function Dashboard() {
  usePageConfig('Dashboard');

  const navigate = useNavigate();
  const { stats, recentSessions, chartData, isLoading, error } = useDashboardData();

  const hasSessions = stats !== null && stats.sessionCount > 0;

  useEffect(() => {
    if (error) {
      navigate('/error', { replace: true, state: { error } });
    }
  }, [error, navigate]);

  if (!isLoading && !hasSessions) {
    return (
      <div className="flex-1 bg-background px-4 py-6 flex flex-col">
        <EmptyState
          icon="zap"
          title="No charging sessions yet"
          message="Add your first session to start tracking your EV charging stats."
          actionLabel="Add Session"
          onAction={() => navigate('/sessions/add')}
        />
      </div>
    );
  }

  if (isLoading || !stats || !chartData) {
    return null;
  }

  return (
    <div className="bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <Section title="Last 31 Days" noCard>
          <ChargeStats stats={stats} />
          <ChargeSessionsCharts data={chartData} stats={stats} />
        </Section>

        {recentSessions.length > 0 && (
          <Section
            title="Recent Sessions"
            action={
              <Link to="/sessions" className="text-primary text-sm font-medium">
                View all
              </Link>
            }
            noCard
          >
            <DashboardRecentSessions sessions={recentSessions} />
          </Section>
        )}
      </div>
    </div>
  );
}
