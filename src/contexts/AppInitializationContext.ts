import { createContext } from 'react';

export type AppInitializationContextValue = {
  isInitialized: boolean;
  error: string | null;
};

export const AppInitializationContext = createContext<AppInitializationContextValue | null>(null);
