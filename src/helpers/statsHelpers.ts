import type { ChargingSessionRecord, VehicleRecord, LocationRecord } from '../data/data-types';
import { getVehicleDisplayName } from './sessionHelpers';
import type { SessionWithMetadata } from './sessionHelpers';
import type { SessionStats, LocationStat } from '../pages/dashboard/dashboard-types';
import { RECENT_SESSIONS_LIMIT } from '../constants';

export function computeStats(
  sessions: ChargingSessionRecord[],
  locationMap: Map<string, LocationRecord>
): SessionStats {
  const totalKwh = sessions.reduce((sum, s) => sum + s.energyKwh, 0);
  const totalCostCents = sessions.reduce((sum, s) => sum + s.costCents, 0);

  // group by location
  const byLocation = Array.from(
    sessions
      .reduce((group, s) => {
        const existing = group.get(s.locationId);

        if (existing) {
          existing.totalKwh += s.energyKwh;
          existing.totalCostCents += s.costCents;
        } else {
          const location = locationMap.get(s.locationId);
          group.set(s.locationId, {
            locationId: s.locationId,
            name: location?.name ?? 'Unknown',
            color: location?.color ?? '#c084fc', // other color
            totalKwh: s.energyKwh,
            totalCostCents: s.costCents
          });
        }

        return group;
      }, new Map<string, LocationStat>())
      .values()
  );

  // Avoid divide-by-zero when no sessions have energy recorded
  const avgRatePerKwh = totalKwh > 0 ? totalCostCents / 100 / totalKwh : 0;

  return { totalKwh, totalCostCents, avgRatePerKwh, sessionCount: sessions.length, byLocation };
}

export function buildRecentSessions(
  sessions: ChargingSessionRecord[],
  vehicleMap: Map<string, VehicleRecord>,
  locationMap: Map<string, LocationRecord>,
  limit: number = RECENT_SESSIONS_LIMIT
): SessionWithMetadata[] {
  const recentSessions = sessions
    .filter((s) => vehicleMap.has(s.vehicleId) && locationMap.has(s.locationId))
    .slice(0, limit)
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
