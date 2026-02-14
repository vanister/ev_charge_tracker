import { usePageTitle } from '../hooks/usePageTitle';

export function Dashboard() {
  usePageTitle('Dashboard');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-body">Dashboard</h1>
        <p className="mt-2 text-body-tertiary">Coming soon...</p>
      </div>
    </div>
  );
}
