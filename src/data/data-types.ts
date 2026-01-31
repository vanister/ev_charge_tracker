export type Location = {
  id: string;
  name: string;
  icon: string;
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
