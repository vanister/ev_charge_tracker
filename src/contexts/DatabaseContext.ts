import { createContext } from 'react';
import type Dexie from 'dexie';
import type { Vehicle, ChargingSession, Settings, Location } from '../data/data-types';
import type { EntityTable } from 'dexie';

type Database = Dexie & {
  vehicles: EntityTable<Vehicle, 'id'>;
  sessions: EntityTable<ChargingSession, 'id'>;
  settings: EntityTable<Settings, 'key'>;
  locations: EntityTable<Location, 'id'>;
};

export type DatabaseContextValue = {
  db: Database;
};

export const DatabaseContext = createContext<DatabaseContextValue | null>(null);
