import { useState, useEffect } from 'react';
import { useSessions } from './useSessions';
import { useVehicles } from './useVehicles';
import { useLocations } from './useLocations';
import type { ChargingSession, Vehicle, Location } from '../data/data-types';
import { createVehicleMap, createLocationMap, getVehicleDisplayName } from '../helpers/sessionHelpers';
import type { SessionWithMetadata } from '../helpers/sessionHelpers';

type LocationStat = {
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

type UseStatsResult = {
  stats: SessionStats | null;
  recentSessions: SessionWithMetadata[];
  isLoading: boolean;
};

// todo - move this to settings
const RECENT_SESSIONS_LIMIT = 5;

export function useStats(): UseStatsResult {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<SessionWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getSessionList } = useSessions();
  const { getVehicleList } = useVehicles();
  const { getLocationList } = useLocations();

  useEffect(() => {
    Promise.all([getSessionList(), getVehicleList(), getLocationList(true)])
      .then(([sessions, vehicles, locations]) => {
        const vehicleMap = createVehicleMap(vehicles);
        const locationMap = createLocationMap(locations);

        setStats(computeStats(sessions, locationMap));
        setRecentSessions(buildRecentSessions(sessions, vehicleMap, locationMap));
      })
      .finally(() => setIsLoading(false));
  }, [getSessionList, getVehicleList, getLocationList]);

  return { stats, recentSessions, isLoading };
}

// todo -  move these out into a helper
function computeStats(sessions: ChargingSession[], locationMap: Map<string, Location>): SessionStats {
  const locationAccum = new Map<string, LocationStat>();
  let totalKwh = 0;
  let totalCostCents = 0;

  for (const session of sessions) {
    totalKwh += session.energyKwh;
    totalCostCents += session.costCents;

    const existing = locationAccum.get(session.locationId);

    if (existing) {
      existing.totalKwh += session.energyKwh;
      existing.totalCostCents += session.costCents;
    } else {
      locationAccum.set(session.locationId, {
        locationId: session.locationId,
        name: locationMap.get(session.locationId)?.name ?? 'Unknown',
        totalKwh: session.energyKwh,
        totalCostCents: session.costCents
      });
    }
  }

  // Avoid divide-by-zero when no sessions have energy recorded
  const avgRatePerKwh = totalKwh > 0 ? totalCostCents / 100 / totalKwh : 0;

  return {
    totalKwh,
    totalCostCents,
    avgRatePerKwh,
    sessionCount: sessions.length,
    byLocation: Array.from(locationAccum.values())
  };
}

// todo - move this into a helper
function buildRecentSessions(
  sessions: ChargingSession[],
  vehicleMap: Map<string, Vehicle>,
  locationMap: Map<string, Location>
): SessionWithMetadata[] {
  const result: SessionWithMetadata[] = [];

  for (const session of sessions) {
    if (result.length >= RECENT_SESSIONS_LIMIT) {
      break;
    }

    const vehicle = vehicleMap.get(session.vehicleId);
    const location = locationMap.get(session.locationId);

    if (!vehicle || !location) {
      continue;
    }

    result.push({
      session,
      vehicleName: getVehicleDisplayName(vehicle),
      locationName: location.name,
      locationIcon: location.icon,
      locationColor: location.color
    });
  }

  return result;
}
