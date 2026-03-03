import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-body mb-2">Page Not Found</h1>
        <p className="text-accent mb-4">404</p>
        <p className="text-sm text-body-tertiary">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="text-sm text-primary hover:text-primary-hover mt-4 block mx-auto"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
