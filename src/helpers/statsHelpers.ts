import type { ChargingSessionRecord, VehicleRecord, LocationRecord, SettingsRecord } from '../data/data-types';
import { getVehicleDisplayName } from './sessionHelpers';
import type { SessionWithMetadata } from './sessionHelpers';
import type { SessionStats, LocationStat } from '../pages/dashboard/dashboard-types';
import { RECENT_SESSIONS_LIMIT } from '../constants';
import { getMiPerKwh } from './gasComparisonHelpers';

export function computeStats(
  sessions: ChargingSessionRecord[],
  locationMap: Map<string, LocationRecord>,
  allSessions: ChargingSessionRecord[],
  vehicleMap: Map<string, VehicleRecord>,
  settings: SettingsRecord | null
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

  const priorOdometerById = buildPriorOdometerMap(allSessions);
  const absorbedIds = buildAbsorbedSessionIds(sessions, priorOdometerById);
  const defaultMiPerKwh = settings?.defaultMiPerKwh;

  let totalMiles = 0;
  let milesIncludeEstimates = false;

  for (const session of sessions) {
    // No-odo sessions sitting between two odometer readings have their miles
    // already counted in the next reading's delta — skip them to avoid double counting.
    if (absorbedIds.has(session.id)) {
      continue;
    }

    const priorOdometer = priorOdometerById.get(session.id);

    if (session.odometer !== undefined && priorOdometer !== undefined) {
      totalMiles += session.odometer - priorOdometer;
      continue;
    }

    const vehicle = vehicleMap.get(session.vehicleId) ?? null;
    totalMiles += session.energyKwh * getMiPerKwh(vehicle, defaultMiPerKwh);
    milesIncludeEstimates = true;
  }

  return {
    totalKwh,
    totalCostCents,
    avgRatePerKwh,
    sessionCount: sessions.length,
    totalMiles,
    milesIncludeEstimates,
    byLocation
  };
}

// Sessions without an odometer reading that sit between a prior odometer reading and a
// future in-filter odometer reading are "absorbed": their miles are already counted in
// the future delta, so they must contribute zero to the total.
function buildAbsorbedSessionIds(
  filtered: ChargingSessionRecord[],
  priorOdometerById: Map<string, number>
): Set<string> {
  const byVehicle = new Map<string, ChargingSessionRecord[]>();

  for (const session of filtered) {
    const list = byVehicle.get(session.vehicleId) ?? [];
    list.push(session);
    byVehicle.set(session.vehicleId, list);
  }

  const absorbed = new Set<string>();

  for (const list of byVehicle.values()) {
    list.sort((a, b) => a.chargedAt - b.chargedAt);

    let hasFutureOdo = false;
    for (let i = list.length - 1; i >= 0; i--) {
      const session = list[i];
      const hasPrior = priorOdometerById.has(session.id);

      if (session.odometer === undefined && hasFutureOdo && hasPrior) {
        absorbed.add(session.id);
      }

      if (session.odometer !== undefined) {
        hasFutureOdo = true;
      }
    }
  }

  return absorbed;
}

// Maps each session id to the most recent prior odometer reading for the same vehicle,
// looked up across ALL sessions so a filter window doesn't lose the immediately preceding reading.
function buildPriorOdometerMap(allSessions: ChargingSessionRecord[]): Map<string, number> {
  const sortedByVehicle = new Map<string, ChargingSessionRecord[]>();

  for (const session of allSessions) {
    const list = sortedByVehicle.get(session.vehicleId) ?? [];
    list.push(session);
    sortedByVehicle.set(session.vehicleId, list);
  }

  const result = new Map<string, number>();

  for (const list of sortedByVehicle.values()) {
    list.sort((a, b) => a.chargedAt - b.chargedAt);

    let lastOdometer: number | undefined = undefined;

    for (const session of list) {
      if (lastOdometer !== undefined) {
        result.set(session.id, lastOdometer);
      }
      if (session.odometer !== undefined) {
        lastOdometer = session.odometer;
      }
    }
  }

  return result;
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
