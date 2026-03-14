import { useState, useEffect } from 'react';
import { useSessions } from '../../hooks/useSessions';
import { useVehicles } from '../../hooks/useVehicles';
import { useLocations } from '../../hooks/useLocations';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { createVehicleMap, createLocationMap } from '../../helpers/sessionHelpers';
import type { SessionWithMetadata } from '../../helpers/sessionHelpers';
import type { Vehicle, Location } from '../../data/data-types';
import type { SessionStats, DashboardFilter } from './dashboard-types';
import { computeStats, buildRecentSessions } from '../../helpers/statsHelpers';
import { buildChartData, buildMonthlyChartData, getChartNumDays, getChartNumMonths } from '../../helpers/chartHelpers';
import { getDateRangeForTimeFilter } from '../../utilities/dateUtils';
import type { ChartData } from './chart-types';

type UseDashboardDataResult = {
  stats: SessionStats | null;
  recentSessions: SessionWithMetadata[];
  chartData: ChartData | null;
  vehicles: Vehicle[];
  locations: Location[];
  hasAnySessions: boolean;
  isLoading: boolean;
  error: string | null;
};

const MONTHLY_TIME_RANGES = new Set(['6m', '12m', 'all']);

export function useDashboardData(filter: DashboardFilter): UseDashboardDataResult {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<SessionWithMetadata[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [hasAnySessions, setHasAnySessions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getSessionList } = useSessions();
  const { getVehicleList } = useVehicles();
  const { getLocationList } = useLocations();
  const { preferences } = useUserPreferences();

  useEffect(() => {
    const loadData = async () => {
      const [sessionResult, vehicleResult, locationResult] = await Promise.all([
        getSessionList(),
        getVehicleList(),
        getLocationList(true)
      ]);

      if (!sessionResult.success || !vehicleResult.success || !locationResult.success) {
        setError('Failed to load dashboard data');
        setIsLoading(false);
        return;
      }

      const allSessions = sessionResult.data;
      setHasAnySessions(allSessions.length > 0);
      setVehicles(vehicleResult.data);
      setLocations(locationResult.data);

      const vehicleMap = createVehicleMap(vehicleResult.data);
      const locationMap = createLocationMap(locationResult.data);

      // Filter sessions in-memory so recentSessions can use the unfiltered list
      const dateRange = getDateRangeForTimeFilter(filter.timeRange);
      const filtered = allSessions.filter((s) => {
        if (filter.vehicleId && s.vehicleId !== filter.vehicleId) return false;
        if (filter.locationId && s.locationId !== filter.locationId) return false;
        if (dateRange && (s.chargedAt < dateRange.start || s.chargedAt > dateRange.end)) return false;
        return true;
      });

      const computedStats = computeStats(filtered, locationMap);

      // When filtering by location, only show that location in the chart
      const locationsForChart = filter.locationId
        ? locationResult.data.filter((l) => l.id === filter.locationId)
        : locationResult.data;

      const isMonthly = MONTHLY_TIME_RANGES.has(filter.timeRange);
      const computedChartData = isMonthly
        ? buildMonthlyChartData(filtered, locationsForChart, getChartNumMonths(filter.timeRange))
        : buildChartData(filtered, locationsForChart, getChartNumDays(filter.timeRange));

      const computedRecentSessions = buildRecentSessions(
        allSessions,
        vehicleMap,
        locationMap,
        preferences.recentSessionsLimit
      );

      setStats(computedStats);
      setChartData(computedChartData);
      setRecentSessions(computedRecentSessions);
      setIsLoading(false);
    };

    loadData();
  }, [
    getSessionList,
    getVehicleList,
    getLocationList,
    filter.timeRange,
    filter.vehicleId,
    filter.locationId,
    preferences.recentSessionsLimit
  ]);

  return { stats, recentSessions, chartData, vehicles, locations, hasAnySessions, isLoading, error };
}
