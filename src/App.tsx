import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppInitialization } from './hooks/useAppInitialization';
import { FullscreenLoader } from './components/FullscreenLoader';
import { ToastProvider } from './providers/ToastProvider';

export function App() {
  const { isInitialized, error } = useAppInitialization();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && error) {
      navigate('/error', { replace: true, state: { error } });
    }
  }, [error, isInitialized, navigate]);

  if (!isInitialized) {
    return <FullscreenLoader />;
  }

  return (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  );
}
