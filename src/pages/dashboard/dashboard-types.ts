import type { TimeFilterValue } from '../../types/shared-types';

export type DashboardFilter = {
  timeRange: TimeFilterValue;
  vehicleId: string | undefined;
  locationId: string | undefined;
};

export type LocationStat = {
  locationId: string;
  name: string;
  color: string;
  totalKwh: number;
  totalCostCents: number;
  sessionCount: number;
};

export type SessionStats = {
  totalKwh: number;
  totalCostCents: number;
  avgRatePerKwh: number;
  avgMiPerKwh: number;
  sessionCount: number;
  totalMiles: number;
  milesIncludeEstimates: boolean;
  byLocation: LocationStat[];
};

export type GasComparisonStats = {
  miPerKwh: number;
  mpge: number;
  comparisonMpg: number;
  gasCostCents: number;
  savingsCents: number;
  avgGasPriceCents: number;
  isGasMateriallyCheaper: boolean;
};
