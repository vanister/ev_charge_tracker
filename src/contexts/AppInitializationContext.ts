import { createContext } from 'react';
import type { Settings } from '../data/data-types';

export type AppInitializationContextValue = {
  isInitialized: boolean;
  needsOnboarding: boolean;
  settings: Settings | null;
  error: string | null;
};

export const AppInitializationContext = createContext<AppInitializationContextValue | null>(null);
