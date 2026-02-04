import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { AppInitializationContext } from '../contexts/AppInitializationContext';
import { loadSettings, seedDefaultLocations } from '../utilities/dataUtils';

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
  const [error, setError] = useState<string | null>(null);

  // Prevent double initialization in React Strict Mode (development only)
  // db and storage are stable references outside React lifecycle
  const initializing = useRef(false);

  useEffect(() => {
    if (initializing.current) {
      return;
    }

    initializing.current = true;

    const initialize = async () => {
      try {
        await loadSettings(db);
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
    };

    initialize();
  }, []);

  return (
    <AppInitializationContext.Provider value={{ isInitialized, error }}>
      {children}
    </AppInitializationContext.Provider>
  );
}
