import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppInitialization } from './hooks/useAppInitialization';
import { FullscreenLoader } from './components/FullscreenLoader';

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

  return <Outlet />;
}
