import { useLocation } from 'react-router-dom';

type ErrorPageState = {
  error?: string;
};

export function ErrorPage() {
  const location = useLocation();
  const state = location.state as ErrorPageState | null;
  const error = state?.error || 'An unexpected error occurred during initialization';

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="p-8 text-center">
        <h1 className="text-body mb-2 text-2xl font-bold">Application Error</h1>
        <p className="text-accent mb-4">Something went wrong</p>
        <p className="text-body-tertiary text-sm">{error}</p>
        <p className="text-muted mt-4 text-sm">Please refresh the page to try again</p>
      </div>
    </div>
  );
}
