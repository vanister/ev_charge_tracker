import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { FullscreenLoader } from './FullscreenLoader';
import type { Settings } from '../data/data-types';

export function RequireOnboarding() {
  const { getSettings } = useSettings();
  const [settings, setSettings] = useState<Settings | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSettings().then(setSettings).finally(() => setIsLoading(false));
  }, [getSettings]);

  useEffect(() => {
    if (!settings) {
      return;
    }

    if (!settings.onboardingComplete) {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate, settings]);

  if (isLoading || !settings?.onboardingComplete) {
    return <FullscreenLoader />;
  }

  return <Outlet />;
}
