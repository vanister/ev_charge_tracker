import type { ChargingSession, Location, Settings, Vehicle } from '../../data/data-types';

export type StoreExport =
  | { store: 'vehicles'; records: Vehicle[] }
  | { store: 'sessions'; records: ChargingSession[] }
  | { store: 'locations'; records: Location[] }
  | { store: 'settings'; records: Settings[] };

export type BackupFile = {
  dbVersion: number;
  fileVersion: number;
  timestamp: number;
  data: StoreExport[];
};
