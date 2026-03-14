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
};

export type SessionStats = {
  totalKwh: number;
  totalCostCents: number;
  avgRatePerKwh: number;
  sessionCount: number;
  byLocation: LocationStat[];
};
