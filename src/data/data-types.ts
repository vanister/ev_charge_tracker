import type { Dexie, EntityTable } from 'dexie';
import type { z } from 'zod';
import type {
  VehicleSchema,
  LocationSchema,
  ChargingSessionSchema,
  SettingsSchema,
  SystemConfigSchema,
  ProviderConfigSchema,
  OAuthTokensSchema
} from './schemas';

export type ActiveState = 0 | 1;

export type Vehicle = z.infer<typeof VehicleSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type ChargingSession = z.infer<typeof ChargingSessionSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type SystemConfig = z.infer<typeof SystemConfigSchema>;
export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;
export type OAuthTokens = z.infer<typeof OAuthTokensSchema>;

export type EvChargTrackerDb = Dexie & {
  vehicles: EntityTable<Vehicle, 'id'>;
  sessions: EntityTable<ChargingSession, 'id'>;
  settings: EntityTable<Settings, 'key'>;
  locations: EntityTable<Location, 'id'>;
  systemConfig: EntityTable<SystemConfig, 'key'>;
};
