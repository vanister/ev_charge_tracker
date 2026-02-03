import { useLocation } from 'react-router-dom';

type ErrorPageState = {
  error?: string;
};

export function ErrorPage() {
  const location = useLocation();
  const state = location.state as ErrorPageState | null;
  const error = state?.error || 'An unexpected error occurred';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">EV Charge Tracker</h1>
        <p className="text-red-600 mb-4">Error</p>
        <p className="text-sm text-gray-600">{error}</p>
        <p className="text-sm text-gray-500 mt-4">Please refresh the page to try again</p>
      </div>
    </div>
  );
}
