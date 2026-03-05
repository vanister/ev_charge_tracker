import { useState, useEffect } from 'react';
import { useSessions } from './useSessions';
import { useVehicles } from './useVehicles';
import { useLocations } from './useLocations';
import { useUserPreferences } from './useUserPreferences';
import { createVehicleMap, createLocationMap } from '../helpers/sessionHelpers';
import type { SessionWithMetadata } from '../helpers/sessionHelpers';
import type { SessionStats } from '../pages/dashboard/dashboard-types';
import { computeStats, buildRecentSessions } from '../helpers/statsHelpers';

type UseStatsResult = {
  stats: SessionStats | null;
  recentSessions: SessionWithMetadata[];
  isLoading: boolean;
  error: string | null;
};

export function useStats(): UseStatsResult {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<SessionWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getSessionList } = useSessions();
  const { getVehicleList } = useVehicles();
  const { getLocationList } = useLocations();
  const { preferences } = useUserPreferences();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [sessionResult, vehicleResult, locationResult] = await Promise.all([
          getSessionList(),
          getVehicleList(),
          getLocationList(true)
        ]);

        if (!sessionResult.success || !vehicleResult.success || !locationResult.success) {
          setError('Failed to load stats');
          return;
        }

        const vehicleMap = createVehicleMap(vehicleResult.data);
        const locationMap = createLocationMap(locationResult.data);
        const recent = buildRecentSessions(
          sessionResult.data,
          vehicleMap,
          locationMap,
          preferences.recentSessionsLimit
        );

        setStats(computeStats(sessionResult.data, locationMap));
        setRecentSessions(recent);
      } catch (err) {
        console.error('Failed to load stats:', err);
        setError('Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [getSessionList, getVehicleList, getLocationList, preferences.recentSessionsLimit]);

  return { stats, recentSessions, isLoading, error };
}
