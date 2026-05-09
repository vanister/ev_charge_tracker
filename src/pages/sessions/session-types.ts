export type SessionFormData = {
  vehicleId: string;
  locationId: string;
  energyKwh: string;
  ratePerKwh: string;
  gasPriceStr: string;
  chargedAt: string;
  notes: string;
  odometerStr: string;
};

export type SessionInputData = {
  vehicleId: string;
  locationId: string;
  energyKwh: number;
  ratePerKwh: number;
  chargedAt: number;
  notes: string;
  odometer?: number;
};
