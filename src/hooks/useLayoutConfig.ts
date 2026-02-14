import { useContext } from 'react';
import { LayoutConfigContext } from '../contexts/LayoutConfigContext';

export function useLayoutConfig() {
  const context = useContext(LayoutConfigContext);

  if (!context) {
    throw new Error('useLayoutConfig must be used within LayoutConfigProvider');
  }

  return context;
}
