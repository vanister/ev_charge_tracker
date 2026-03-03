import { createContext } from 'react';
import type { EvChargTrackerDb } from '../data/data-types';

export type DatabaseContextValue = {
  db: EvChargTrackerDb;
};

export const DatabaseContext = createContext<DatabaseContextValue | null>(null);
