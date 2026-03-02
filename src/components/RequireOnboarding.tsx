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
    const loadSettings = async () => {
      try {
        const result = await getSettings();

        if (!result.success) {
          navigate('/error', { replace: true, state: { error: result.error } });
          return;
        }

        setSettings(result.data);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [getSettings, navigate]);

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
