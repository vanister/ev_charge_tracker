import type { Dexie, EntityTable } from 'dexie';
import type { z } from 'zod';
import type {
  VehicleRecordSchema,
  LocationRecordSchema,
  ChargingSessionRecordSchema,
  SettingsRecordSchema,
  SystemConfigRecordSchema,
  ProviderConfigRecordSchema,
  OAuthTokensRecordSchema,
  MaintenanceRecordSchema
} from './schemas';

export type ActiveState = 0 | 1;

export type VehicleRecord = z.infer<typeof VehicleRecordSchema>;
export type LocationRecord = z.infer<typeof LocationRecordSchema>;
export type ChargingSessionRecord = z.infer<typeof ChargingSessionRecordSchema>;
export type SettingsRecord = z.infer<typeof SettingsRecordSchema>;
export type SystemConfigRecord = z.infer<typeof SystemConfigRecordSchema>;
export type ProviderConfigRecord = z.infer<typeof ProviderConfigRecordSchema>;
export type OAuthTokensRecord = z.infer<typeof OAuthTokensRecordSchema>;
export type MaintenanceRecord = z.infer<typeof MaintenanceRecordSchema>;

export type EvChargTrackerDb = Dexie & {
  vehicles: EntityTable<VehicleRecord, 'id'>;
  sessions: EntityTable<ChargingSessionRecord, 'id'>;
  settings: EntityTable<SettingsRecord, 'key'>;
  locations: EntityTable<LocationRecord, 'id'>;
  systemConfig: EntityTable<SystemConfigRecord, 'key'>;
  maintenanceRecords: EntityTable<MaintenanceRecord, 'id'>;
};
