import type { ChargingSessionRecord, VehicleRecord, LocationRecord, SettingsRecord } from '../data/data-types';
import { getVehicleDisplayName } from './sessionHelpers';
import type { SessionWithMetadata } from './sessionHelpers';
import type { SessionStats, LocationStat } from '../pages/dashboard/dashboard-types';
import { RECENT_SESSIONS_LIMIT } from '../constants';
import { getMiPerKwh } from './gasComparisonHelpers';

type MilesContribution = { miles: number; estimated: boolean };

export function computeStats(
  sessions: ChargingSessionRecord[],
  locationMap: Map<string, LocationRecord>,
  allSessions: ChargingSessionRecord[],
  vehicleMap: Map<string, VehicleRecord>,
  settings: SettingsRecord | null
): SessionStats {
  const totalKwh = sessions.reduce((sum, s) => sum + s.energyKwh, 0);
  const totalCostCents = sessions.reduce((sum, s) => sum + s.costCents, 0);
  // Avoid divide-by-zero when no sessions have energy recorded
  const avgRatePerKwh = totalKwh > 0 ? totalCostCents / 100 / totalKwh : 0;
  const byLocation = aggregateByLocation(sessions, locationMap);
  const { totalMiles, milesIncludeEstimates } = computeMilesTotals(
    sessions,
    allSessions,
    vehicleMap,
    settings
  );

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

function aggregateByLocation(
  sessions: readonly ChargingSessionRecord[],
  locationMap: ReadonlyMap<string, LocationRecord>
): LocationStat[] {
  const grouped = sessions.reduce<Map<string, LocationStat>>((acc, session) => {
    const existing = acc.get(session.locationId);

    if (existing) {
      acc.set(session.locationId, {
        ...existing,
        totalKwh: existing.totalKwh + session.energyKwh,
        totalCostCents: existing.totalCostCents + session.costCents
      });
      return acc;
    }

    const location = locationMap.get(session.locationId);
    acc.set(session.locationId, {
      locationId: session.locationId,
      name: location?.name ?? 'Unknown',
      // 'Other' fallback color
      color: location?.color ?? '#c084fc',
      totalKwh: session.energyKwh,
      totalCostCents: session.costCents
    });
    return acc;
  }, new Map());

  return Array.from(grouped.values());
}

function computeMilesTotals(
  filtered: readonly ChargingSessionRecord[],
  allSessions: readonly ChargingSessionRecord[],
  vehicleMap: ReadonlyMap<string, VehicleRecord>,
  settings: SettingsRecord | null
): { totalMiles: number; milesIncludeEstimates: boolean } {
  const priorOdometerById = buildPriorOdometerMap(allSessions);
  const absorbedIds = buildAbsorbedSessionIds(filtered, priorOdometerById);
  const defaultMiPerKwh = settings?.defaultMiPerKwh;

  const contributions = filtered.map((session) =>
    attributeMiles(session, priorOdometerById, absorbedIds, vehicleMap, defaultMiPerKwh)
  );

  return {
    totalMiles: contributions.reduce((sum, c) => sum + c.miles, 0),
    milesIncludeEstimates: contributions.some((c) => c.estimated)
  };
}

function attributeMiles(
  session: ChargingSessionRecord,
  priorOdometerById: ReadonlyMap<string, number>,
  absorbedIds: ReadonlySet<string>,
  vehicleMap: ReadonlyMap<string, VehicleRecord>,
  defaultMiPerKwh: number | undefined
): MilesContribution {
  // A no-odo session sitting between two odometer readings is already covered
  // by the next reading's delta, so it must contribute zero.
  if (absorbedIds.has(session.id)) {
    return { miles: 0, estimated: false };
  }

  const priorOdometer = priorOdometerById.get(session.id);

  if (session.odometer !== undefined && priorOdometer !== undefined) {
    return { miles: session.odometer - priorOdometer, estimated: false };
  }

  const vehicle = vehicleMap.get(session.vehicleId) ?? null;
  return {
    miles: session.energyKwh * getMiPerKwh(vehicle, defaultMiPerKwh),
    estimated: true
  };
}

// Maps each session id to the most recent prior odometer reading for the same vehicle,
// looked up across ALL sessions so a filter window doesn't lose the immediately preceding reading.
function buildPriorOdometerMap(
  allSessions: readonly ChargingSessionRecord[]
): ReadonlyMap<string, number> {
  const entries = Array.from(groupByVehicle(allSessions).values()).flatMap((list) =>
    collectPriorOdometerEntries(sortByChargedAt(list))
  );
  return new Map(entries);
}

function collectPriorOdometerEntries(
  sorted: readonly ChargingSessionRecord[]
): readonly (readonly [string, number])[] {
  return sorted.reduce<{
    lastOdometer: number | undefined;
    entries: readonly (readonly [string, number])[];
  }>(
    ({ lastOdometer, entries }, session) => ({
      lastOdometer: session.odometer !== undefined ? session.odometer : lastOdometer,
      entries: lastOdometer !== undefined ? [...entries, [session.id, lastOdometer]] : entries
    }),
    { lastOdometer: undefined, entries: [] }
  ).entries;
}

function buildAbsorbedSessionIds(
  filtered: readonly ChargingSessionRecord[],
  priorOdometerById: ReadonlyMap<string, number>
): ReadonlySet<string> {
  const ids = Array.from(groupByVehicle(filtered).values()).flatMap((list) =>
    findAbsorbedIds(sortByChargedAt(list), priorOdometerById)
  );
  return new Set(ids);
}

function findAbsorbedIds(
  sorted: readonly ChargingSessionRecord[],
  priorOdometerById: ReadonlyMap<string, number>
): readonly string[] {
  return sorted.reduceRight<{ hasFutureOdo: boolean; ids: readonly string[] }>(
    ({ hasFutureOdo, ids }, session) => {
      const isAbsorbed =
        session.odometer === undefined && hasFutureOdo && priorOdometerById.has(session.id);
      return {
        hasFutureOdo: hasFutureOdo || session.odometer !== undefined,
        ids: isAbsorbed ? [session.id, ...ids] : ids
      };
    },
    { hasFutureOdo: false, ids: [] }
  ).ids;
}

function groupByVehicle(
  sessions: readonly ChargingSessionRecord[]
): ReadonlyMap<string, readonly ChargingSessionRecord[]> {
  return sessions.reduce<Map<string, ChargingSessionRecord[]>>((acc, session) => {
    const list = acc.get(session.vehicleId) ?? [];
    acc.set(session.vehicleId, [...list, session]);
    return acc;
  }, new Map());
}

function sortByChargedAt(
  sessions: readonly ChargingSessionRecord[]
): readonly ChargingSessionRecord[] {
  return [...sessions].sort((a, b) => a.chargedAt - b.chargedAt);
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
