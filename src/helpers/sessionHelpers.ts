import type { ChargingSession, Vehicle, Location } from '../data/data-types';
import type { IconName } from '../components/Icon';
import { getDateGroupKey } from '../utilities/dateUtils';

export type SessionWithMetadata = {
  session: ChargingSession;
  vehicleName: string;
  locationName: string;
  locationIcon: IconName;
  locationColor: string;
};

export type SessionsByDate = [string, SessionWithMetadata[]][];

export function createVehicleMap(vehicles: Vehicle[]) {
  return new Map(vehicles.map((v) => [v.id, v]));
}

export function createLocationMap(locations: Location[]) {
  return new Map(locations.map((l) => [l.id, l]));
}

export function getVehicleDisplayName(vehicle: Vehicle): string {
  return vehicle.name || `${vehicle.make} ${vehicle.model}`;
}

export function groupSessionsByDate(
  sessions: ChargingSession[],
  vehicleMap: Map<string, Vehicle>,
  locationMap: Map<string, Location>
): SessionsByDate {
  const grouped = new Map<string, SessionWithMetadata[]>();

  for (const session of sessions) {
    const vehicle = vehicleMap.get(session.vehicleId);
    const location = locationMap.get(session.locationId);

    if (!vehicle || !location) {
      continue;
    }

    const dateKey = getDateGroupKey(session.chargedAt);
    const sessionWithMetadata: SessionWithMetadata = {
      session,
      vehicleName: getVehicleDisplayName(vehicle),
      locationName: location.name,
      locationIcon: location.icon,
      locationColor: location.color
    };

    const existing = grouped.get(dateKey);
    if (existing) {
      existing.push(sessionWithMetadata);
    } else {
      grouped.set(dateKey, [sessionWithMetadata]);
    }
  }

  return Array.from(grouped.entries()).sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
}
