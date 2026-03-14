export type UserPreferences = {
  lastVehicleId?: string;
  lastLocationId?: string;
  recentSessionsLimit: number;
  sessionsFilterTimeRange?: string;
  sessionsFilterVehicleId?: string;
  sessionsFilterLocationId?: string;
  sessionsFilterIsOpen?: boolean;
  dashboardFilterTimeRange?: string;
  dashboardFilterVehicleId?: string;
  dashboardFilterLocationId?: string;
  dashboardFilterIsOpen?: boolean;
};
