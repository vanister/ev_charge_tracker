import type { ChargingSession, Location, Settings, Vehicle } from '../../data/data-types';

export type BackupFile = {
  version: number;
  vehicles: Vehicle[];
  sessions: ChargingSession[];
  locations: Location[];
  settings: Settings[];
};

export type ExportRestoreState = {
  isExporting: boolean;
  isRestoring: boolean;
  restoreError: string | null;
};
