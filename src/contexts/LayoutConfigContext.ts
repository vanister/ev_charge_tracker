import { createContext } from 'react';

export type LayoutConfigContextValue = {
  title: string;
  setTitle: (title: string) => void;
};

export const LayoutConfigContext = createContext<LayoutConfigContextValue | null>(null);
