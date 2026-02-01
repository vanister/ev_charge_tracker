import { useAppInitialization } from './hooks/useAppInitialization';
import { InitializationError } from './components/InitializationError';
import { InitializationLoading } from './components/InitializationLoading';

export function App() {
  const { isLoading, error } = useAppInitialization();

  if (error) {
    return <InitializationError error={error} />;
  }

  if (isLoading) {
    return <InitializationLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">EV Charge Tracker</h1>
        <p className="text-gray-600">
          Database initialized. Router with routes will be implemented here.
        </p>
      </div>
    </div>
  );
}
