import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { getSettings, seedDefaultLocations } from '../data/utils';
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prevent double initialization in React 18+ Strict Mode (development only)
  // db and storage are stable references outside React lifecycle
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    async function initialize() {
      try {
        // todo: make settings reactive with useLiveQuery in dedicated useSettings() hook
        const settings = await getSettings(db);
        setSettings(settings);

        await seedDefaultLocations(db);

        if (storage?.persist) {
          await storage.persist();
        }
      } catch (err) {
        console.error('App initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize app');
      } finally {
        setIsInitialized(true);
      }
    }

    initialize();
  }, []);

  const needsOnboarding = !settings?.onboardingComplete;

  return (
    <AppInitializationContext.Provider value={{ isInitialized, needsOnboarding, settings, error }}>
      {children}
    </AppInitializationContext.Provider>
  );
}
