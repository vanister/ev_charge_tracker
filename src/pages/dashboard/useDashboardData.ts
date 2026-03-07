import { useState, useEffect } from 'react';
import { useSessions } from '../../hooks/useSessions';
import { useVehicles } from '../../hooks/useVehicles';
import { useLocations } from '../../hooks/useLocations';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { createVehicleMap, createLocationMap } from '../../helpers/sessionHelpers';
import type { SessionWithMetadata } from '../../helpers/sessionHelpers';
import type { SessionStats } from './dashboard-types';
import { computeStats, buildRecentSessions } from '../../helpers/statsHelpers';
import { buildChartData } from '../../helpers/chartHelpers';
import type { ChartData } from './chart-types';

type UseDashboardDataResult = {
  stats: SessionStats | null;
  recentSessions: SessionWithMetadata[];
  chartData: ChartData | null;
  isLoading: boolean;
  error: string | null;
};

export function useDashboardData(): UseDashboardDataResult {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<SessionWithMetadata[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getSessionList } = useSessions();
  const { getVehicleList } = useVehicles();
  const { getLocationList } = useLocations();
  const { preferences } = useUserPreferences();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sessionResult, vehicleResult, locationResult] = await Promise.all([
          getSessionList(),
          getVehicleList(),
          getLocationList(true)
        ]);

        if (!sessionResult.success || !vehicleResult.success || !locationResult.success) {
          setError('Failed to load dashboard data');
          return;
        }

        const vehicleMap = createVehicleMap(vehicleResult.data);
        const locationMap = createLocationMap(locationResult.data);

        setStats(computeStats(sessionResult.data, locationMap));
        setRecentSessions(
          buildRecentSessions(sessionResult.data, vehicleMap, locationMap, preferences.recentSessionsLimit)
        );
        setChartData(buildChartData(sessionResult.data, locationResult.data));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getSessionList, getVehicleList, getLocationList, preferences.recentSessionsLimit]);

  return { stats, recentSessions, chartData, isLoading, error };
}
