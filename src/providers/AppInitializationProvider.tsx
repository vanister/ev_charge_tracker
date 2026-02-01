import { useState, useEffect, type ReactNode } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { getDefaultSettings, seedDefaultLocations } from '../data/utils';
import type { Settings } from '../data/data-types';
import { AppInitializationContext } from '../contexts/AppInitializationContext';

type AppInitializationProviderProps = {
  children: ReactNode;
  storage?: StorageManager;
};

export function AppInitializationProvider({
  children,
  storage = navigator.storage
}: AppInitializationProviderProps) {
  const { db } = useDatabase();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        // todo: make settings reactive with useLiveQuery in dedicated useSettings() hook
        const existingSettings = await db.settings.get('app-settings');

        if (!existingSettings) {
          const defaultSettings = getDefaultSettings();
          await db.settings.add(defaultSettings);
          setSettings(defaultSettings);
        } else {
          setSettings(existingSettings);
        }

        await seedDefaultLocations();

        if (storage && storage.persist) {
          await storage.persist();
        }
      } catch (err) {
        console.error('App initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize app');
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, [db, storage]);

  const needsOnboarding = !settings?.onboardingComplete;

  return (
    <AppInitializationContext.Provider value={{ isLoading, needsOnboarding, settings, error }}>
      {children}
    </AppInitializationContext.Provider>
  );
}
