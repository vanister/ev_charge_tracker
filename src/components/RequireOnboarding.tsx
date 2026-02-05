import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { InitializationLoading } from './InitializationLoading';

export function RequireOnboarding() {
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!settings) {
      return;
    }

    if (!settings.onboardingComplete) {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate, settings]);

  if (!settings?.onboardingComplete) {
    return <InitializationLoading />;
  }

  return <Outlet />;
}
