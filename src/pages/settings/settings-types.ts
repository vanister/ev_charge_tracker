import type { ChargingSession, Location, MaintenanceRecord, Settings, Vehicle } from '../../data/data-types';

export type StoreExport =
  | { store: 'vehicles'; records: Vehicle[] }
  | { store: 'sessions'; records: ChargingSession[] }
  | { store: 'locations'; records: Location[] }
  | { store: 'settings'; records: Settings[] }
  | { store: 'maintenanceRecords'; records: MaintenanceRecord[] };

export type BackupFile = {
  dbVersion: number;
  fileVersion: number;
  timestamp: number;
  // Preserved so restoring a backup also recovers the device's sync identity
  deviceId?: string;
  data: StoreExport[];
};
