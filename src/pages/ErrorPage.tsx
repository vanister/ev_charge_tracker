import { useLocation } from 'react-router-dom';

type ErrorPageState = {
  error?: string;
};

export function ErrorPage() {
  const location = useLocation();
  const state = location.state as ErrorPageState | null;
  const error = state?.error || 'An unexpected error occurred';

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-body mb-2">EV Charge Tracker</h1>
        <p className="text-accent mb-4">Error</p>
        <p className="text-sm text-body-tertiary">{error}</p>
        <p className="text-sm text-muted mt-4">Please refresh the page to try again</p>
      </div>
    </div>
  );
}
