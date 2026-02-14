import { type ReactNode } from 'react';
import { LayoutConfigContext } from '../contexts/LayoutConfigContext';

type LayoutConfigProviderProps = {
  children: ReactNode;
  value: {
    title: string;
    setTitle: (title: string) => void;
  };
};

export function LayoutConfigProvider(props: LayoutConfigProviderProps) {
  const { children, value } = props;

  return <LayoutConfigContext.Provider value={value}>{children}</LayoutConfigContext.Provider>;
}
