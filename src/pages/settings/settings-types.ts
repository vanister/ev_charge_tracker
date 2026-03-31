import type {
  ChargingSessionRecord,
  LocationRecord,
  MaintenanceRecord,
  SettingsRecord,
  VehicleRecord
} from '../../data/data-types';

export type StoreExport =
  | { store: 'vehicles'; records: VehicleRecord[] }
  | { store: 'sessions'; records: ChargingSessionRecord[] }
  | { store: 'locations'; records: LocationRecord[] }
  | { store: 'settings'; records: SettingsRecord[] }
  | { store: 'maintenanceRecords'; records: MaintenanceRecord[] };

export type BackupFile = {
  dbVersion: number;
  fileVersion: number;
  timestamp: number;
  // Preserved so restoring a backup also recovers the device's sync identity
  deviceId?: string;
  data: StoreExport[];
};
