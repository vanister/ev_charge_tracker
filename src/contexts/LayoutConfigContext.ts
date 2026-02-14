import { createContext } from 'react';

type LayoutConfigContextValue = {
  title: string;
  setTitle: (title: string) => void;
};

export const LayoutConfigContext = createContext<LayoutConfigContextValue | null>(null);
