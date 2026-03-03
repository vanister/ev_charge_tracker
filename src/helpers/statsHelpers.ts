import type { ChargingSession, Vehicle, Location } from '../data/data-types';
import { getVehicleDisplayName } from './sessionHelpers';
import type { SessionWithMetadata } from './sessionHelpers';
import type { SessionStats, LocationStat } from '../pages/dashboard/dashboard-types';

const RECENT_SESSIONS_LIMIT = 5;

export function computeStats(sessions: ChargingSession[], locationMap: Map<string, Location>): SessionStats {
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

export function buildRecentSessions(
  sessions: ChargingSession[],
  vehicleMap: Map<string, Vehicle>,
  locationMap: Map<string, Location>
): SessionWithMetadata[] {
  return sessions
    .filter((s) => vehicleMap.has(s.vehicleId) && locationMap.has(s.locationId))
    .slice(0, RECENT_SESSIONS_LIMIT)
    .map((session) => {
      const vehicle = vehicleMap.get(session.vehicleId)!;
      const location = locationMap.get(session.locationId)!;

      return {
        session,
        vehicleName: getVehicleDisplayName(vehicle),
        locationName: location.name,
        locationIcon: location.icon,
        locationColor: location.color
      };
    });
}
