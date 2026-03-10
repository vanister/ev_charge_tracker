import type { Dexie, EntityTable } from 'dexie';
import type { IconName } from '../types/shared-types';
import type { OAuthProvider } from '../constants';

export type ActiveState = 0 | 1;

export type Location = {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  defaultRate: number;
  createdAt: number;
  isActive: ActiveState;
  order?: number;
};

export type Vehicle = {
  id: string;
  name?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  batteryCapacity?: number;
  range?: number;
  notes?: string;
  icon: string;
  createdAt: number;
  isActive: ActiveState;
};

export type ChargingSession = {
  id: string;
  vehicleId: string;
  locationId: string;
  energyKwh: number;
  ratePerKwh: number;
  costCents: number;
  chargedAt: number;
  notes?: string;
};

export type Settings = {
  key: 'app-settings';
  onboardingComplete: boolean;
};

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
