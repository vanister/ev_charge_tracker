export type DefaultRates = {
  HOME: number;
  WORK: number;
  OTHER: number;
  DC: number;
};

export type LocationTypeKey = keyof DefaultRates;

export type LocationTypeConfig = {
  key: LocationTypeKey;
  label: string;
  icon: string;
  color: string;
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
  locationType: LocationTypeKey;
  energyKwh: number;
  ratePerKwh: number;
  costCents: number;
  chargedAt: number;
  notes?: string;
};

export type Settings = {
  key: 'app-settings';
  defaultRates: DefaultRates;
  onboardingComplete: boolean;
};
