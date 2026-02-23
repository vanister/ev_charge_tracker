import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useStats } from '../../hooks/useStats';
import { EmptyState } from '../../components/EmptyState';
import { DashboardStats } from './DashboardStats';
import { DashboardRecentSessions } from './DashboardRecentSessions';

export function Dashboard() {
  usePageTitle('Dashboard');

  const navigate = useNavigate();
  const { stats, recentSessions, isLoading } = useStats();

  const hasSessions = stats !== null && stats.sessionCount > 0;

  if (!isLoading && !hasSessions) {
    return (
      <div className="h-[calc(100vh-5rem)] bg-background px-4 py-6 flex flex-col">
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

  if (isLoading || !stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <DashboardStats stats={stats} />
        {recentSessions.length > 0 && <DashboardRecentSessions sessions={recentSessions} />}
      </div>
    </div>
  );
}
