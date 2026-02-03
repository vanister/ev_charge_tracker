import type { Dexie, EntityTable } from 'dexie';
import type { IconName } from '../components/Icon';

export type Location = {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  defaultRate: number;
  createdAt: number;
  isActive: boolean;
};

export type Vehicle = {
  id: string;
  name: string;
  make?: string;
  model?: string;
  year?: number;
  icon: string;
  createdAt: number;
  isActive: boolean;
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

export type EvChargTrackerDb = Dexie & {
  vehicles: EntityTable<Vehicle, 'id'>;
  sessions: EntityTable<ChargingSession, 'id'>;
  settings: EntityTable<Settings, 'key'>;
  locations: EntityTable<Location, 'id'>;
};
