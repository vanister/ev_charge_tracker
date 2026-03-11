import type { Dexie, EntityTable } from 'dexie';
import type { z } from 'zod';
import type { OAuthProvider } from '../constants';
import type {
  VehicleSchema,
  LocationSchema,
  ChargingSessionSchema,
  SettingsSchema
} from './schemas';

export type ActiveState = 0 | 1;

export type Vehicle = z.infer<typeof VehicleSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type ChargingSession = z.infer<typeof ChargingSessionSchema>;
export type Settings = z.infer<typeof SettingsSchema>;

export type SystemConfig = {
  key: 'system-config';
  oAuthSettings: Record<OAuthProvider, ProviderConfig>;
  oauthTokens?: Record<OAuthProvider, OAuthTokens>;
};

export type ProviderConfig = {
  provider: OAuthProvider;
  clientId: string;
};

export type OAuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type EvChargTrackerDb = Dexie & {
  vehicles: EntityTable<Vehicle, 'id'>;
  sessions: EntityTable<ChargingSession, 'id'>;
  settings: EntityTable<Settings, 'key'>;
  locations: EntityTable<Location, 'id'>;
  systemConfig: EntityTable<SystemConfig, 'key'>;
};
