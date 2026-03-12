import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageConfig } from '../../hooks/usePageConfig';
import { useDashboardData } from './useDashboardData';
import { EmptyState } from '../../components/EmptyState';
import { DashboardContent } from './DashboardContent';

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
      <DashboardContent stats={stats} recentSessions={recentSessions} chartData={chartData} />
    </div>
  );
}
