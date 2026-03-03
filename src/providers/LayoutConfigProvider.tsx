import { type ReactNode } from 'react';
import { LayoutConfigContext } from '../contexts/LayoutConfigContext';
import type { LayoutConfigContextValue } from '../contexts/LayoutConfigContext';

type LayoutConfigProviderProps = {
  children: ReactNode;
  value: LayoutConfigContextValue;
};

export function LayoutConfigProvider(props: LayoutConfigProviderProps) {
  const { children, value } = props;

  return <LayoutConfigContext.Provider value={value}>{children}</LayoutConfigContext.Provider>;
}
