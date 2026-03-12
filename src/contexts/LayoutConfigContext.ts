import { createContext } from 'react';

export type LayoutConfigContextValue = {
  title: string;
  setTitle: (title: string) => void;
  hideTabBar: boolean;
  setHideTabBar: (value: boolean) => void;
};

export const LayoutConfigContext = createContext<LayoutConfigContextValue | null>(null);
