import type { ReactNode } from 'react';
import { DatabaseContext } from '../contexts/DatabaseContext';
import type { DatabaseContextValue } from '../contexts/DatabaseContext';

type DatabaseProviderProps = {
  children: ReactNode;
  db: DatabaseContextValue['db'];
};

export function DatabaseProvider({ children, db }: DatabaseProviderProps) {
  return <DatabaseContext.Provider value={{ db }}>{children}</DatabaseContext.Provider>;
}
