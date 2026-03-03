export type SessionFormData = {
  vehicleId: string;
  locationId: string;
  energyKwh: string;
  ratePerKwh: string;
  chargedAt: string;
  notes: string;
};

export type SessionInputData = {
  vehicleId: string;
  locationId: string;
  energyKwh: number;
  ratePerKwh: number;
  chargedAt: number;
  notes: string;
};
