import type { ChargingSession, Vehicle, Location } from '../data/data-types';
import { getVehicleDisplayName } from './sessionHelpers';
import type { SessionWithMetadata } from './sessionHelpers';
import type { SessionStats, LocationStat } from '../pages/dashboard/dashboard-types';

const RECENT_SESSIONS_LIMIT = 5;

export function computeStats(sessions: ChargingSession[], locationMap: Map<string, Location>): SessionStats {
  const totalKwh = sessions.reduce((sum, s) => sum + s.energyKwh, 0);
  const totalCostCents = sessions.reduce((sum, s) => sum + s.costCents, 0);

  const byLocation = Array.from(
    sessions
      .reduce((accum, s) => {
        const existing = accum.get(s.locationId);

        if (existing) {
          existing.totalKwh += s.energyKwh;
          existing.totalCostCents += s.costCents;
        } else {
          accum.set(s.locationId, {
            locationId: s.locationId,
            name: locationMap.get(s.locationId)?.name ?? 'Unknown',
            totalKwh: s.energyKwh,
            totalCostCents: s.costCents
          });
        }

        return accum;
      }, new Map<string, LocationStat>())
      .values()
  );

  // Avoid divide-by-zero when no sessions have energy recorded
  const avgRatePerKwh = totalKwh > 0 ? totalCostCents / 100 / totalKwh : 0;

  return { totalKwh, totalCostCents, avgRatePerKwh, sessionCount: sessions.length, byLocation };
}

export function buildRecentSessions(
  sessions: ChargingSession[],
  vehicleMap: Map<string, Vehicle>,
  locationMap: Map<string, Location>
): SessionWithMetadata[] {
  const recentSessions = sessions
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

  return recentSessions;
}
