export type LocationStat = {
  locationId: string;
  name: string;
  totalKwh: number;
  totalCostCents: number;
};

export type SessionStats = {
  totalKwh: number;
  totalCostCents: number;
  avgRatePerKwh: number;
  sessionCount: number;
  byLocation: LocationStat[];
};
