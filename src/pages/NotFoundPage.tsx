import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="p-8 text-center">
        <h1 className="text-body mb-2 text-2xl font-bold">Page Not Found</h1>
        <p className="text-accent mb-4">404</p>
        <p className="text-body-tertiary text-sm">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="text-primary hover:text-primary-hover mx-auto mt-4 block text-sm"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
