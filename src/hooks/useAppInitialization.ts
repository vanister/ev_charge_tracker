import { useContext } from 'react';
import { AppInitializationContext } from '../contexts/AppInitializationContext';

export function useAppInitialization() {
  const context = useContext(AppInitializationContext);

  if (!context) {
    throw new Error('useAppInitialization must be used within AppInitializationProvider');
  }

  return context;
}
