import { describe, it, expect } from 'vitest';
import { LOCATION_COLOR_HEX } from '../../src/constants';
import type {
  ChargingSessionRecord,
  VehicleRecord,
  LocationRecord,
  SettingsRecord
} from '../../src/data/data-types';
import { computeStats } from '../../src/helpers/statsHelpers';

const makeVehicle = (overrides: Partial<VehicleRecord> = {}): VehicleRecord => ({
  id: 'v1',
  make: 'Tesla',
  model: 'Model 3',
  year: 2022,
  icon: '🚗',
  createdAt: 0,
  isActive: 1,
  ...overrides
});

const makeLocation = (overrides: Partial<LocationRecord> = {}): LocationRecord => ({
  id: 'l1',
  name: 'Home',
  icon: 'home',
  color: '#aaa',
  defaultRate: 0.15,
  createdAt: 0,
  isActive: 1,
  ...overrides
});

const makeSession = (overrides: Partial<ChargingSessionRecord> = {}): ChargingSessionRecord => ({
  id: 's1',
  vehicleId: 'v1',
  locationId: 'l1',
  energyKwh: 10,
  ratePerKwh: 0.15,
  costCents: 500,
  chargedAt: 0,
  ...overrides
});

const makeSettings = (overrides: Partial<SettingsRecord> = {}): SettingsRecord => ({
  key: 'app-settings',
  onboardingComplete: true,
  backupReminderInterval: '3d',
  ...overrides
});

const VEHICLE_300_RANGE = makeVehicle({ range: 300, batteryCapacity: 100 });

function vehicleMap(vehicles: VehicleRecord[]): Map<string, VehicleRecord> {
  return new Map(vehicles.map((v) => [v.id, v]));
}

function locationMap(locations: LocationRecord[]): Map<string, LocationRecord> {
  return new Map(locations.map((l) => [l.id, l]));
}

describe('computeStats — totalMiles attribution', () => {
  it('looks up the prior odometer reading from outside the filter window', () => {
    const allSessions = [
      makeSession({ id: 'old', chargedAt: 1, odometer: 1000 }),
      makeSession({ id: 'new', chargedAt: 2, odometer: 1200 })
    ];
    const filtered = [allSessions[1]];

    const stats = computeStats(
      filtered,
      locationMap([makeLocation()]),
      allSessions,
      vehicleMap([VEHICLE_300_RANGE]),
      makeSettings()
    );

    expect(stats.totalMiles).toBe(200);
    expect(stats.milesIncludeEstimates).toBe(false);
  });

  it('absorbs no-odo sessions sitting between two odometer readings to avoid double counting', () => {
    const sessions = [
      makeSession({ id: 'a', chargedAt: 1, odometer: 1000 }),
      makeSession({ id: 'b', chargedAt: 2, energyKwh: 10 }),
      makeSession({ id: 'c', chargedAt: 3, odometer: 1200 })
    ];

    const stats = computeStats(
      sessions,
      locationMap([makeLocation()]),
      sessions,
      vehicleMap([VEHICLE_300_RANGE]),
      makeSettings()
    );

    // a: derived (no prior) = 30; b: absorbed = 0; c: 1200 - 1000 = 200
    expect(stats.totalMiles).toBe(30 + 200);
  });

  it('does not absorb a no-odo session when there is no future odometer reading in the filter', () => {
    const sessions = [
      makeSession({ id: 'a', chargedAt: 1, odometer: 1000 }),
      makeSession({ id: 'b', chargedAt: 2, energyKwh: 10 })
    ];

    const stats = computeStats(
      sessions,
      locationMap([makeLocation()]),
      sessions,
      vehicleMap([VEHICLE_300_RANGE]),
      makeSettings()
    );

    // a: derived = 30; b: derived (no future odo to absorb into) = 30
    expect(stats.totalMiles).toBe(60);
    expect(stats.milesIncludeEstimates).toBe(true);
  });

  it('keeps odometer deltas isolated per vehicle when sessions interleave chronologically', () => {
    const v1 = makeVehicle({ id: 'v1', range: 300, batteryCapacity: 100 });
    const v2 = makeVehicle({ id: 'v2', range: 300, batteryCapacity: 100 });
    // Interleaved by chargedAt — a global sort would produce a delta from v2's
    // 5000 to v1's 1100 (-3900), which would be obviously wrong.
    const sessions = [
      makeSession({ id: 'v1-a', vehicleId: 'v1', chargedAt: 1, odometer: 1000 }),
      makeSession({ id: 'v2-a', vehicleId: 'v2', chargedAt: 2, odometer: 5000 }),
      makeSession({ id: 'v1-b', vehicleId: 'v1', chargedAt: 3, odometer: 1100 }),
      makeSession({ id: 'v2-b', vehicleId: 'v2', chargedAt: 4, odometer: 5200 }),
      makeSession({ id: 'v1-c', vehicleId: 'v1', chargedAt: 5, odometer: 1250 })
    ];

    const stats = computeStats(
      sessions,
      locationMap([makeLocation()]),
      sessions,
      vehicleMap([v1, v2]),
      makeSettings()
    );

    // v1-a derived 30, v2-a derived 30, v1-b: 100, v2-b: 200, v1-c: 150
    expect(stats.totalMiles).toBe(30 + 30 + 100 + 200 + 150);
  });

  it('does not clamp negative deltas when an odometer reading regresses', () => {
    const allSessions = [
      makeSession({ id: 'old', chargedAt: 1, odometer: 1000 }),
      makeSession({ id: 'typo', chargedAt: 2, odometer: 950 })
    ];
    const filtered = [allSessions[1]];

    const stats = computeStats(
      filtered,
      locationMap([makeLocation()]),
      allSessions,
      vehicleMap([VEHICLE_300_RANGE]),
      makeSettings()
    );

    // Pins the deliberate non-clamp behavior — a regressing odometer
    // produces a negative delta rather than silently falling back to derived.
    expect(stats.totalMiles).toBe(-50);
    expect(stats.milesIncludeEstimates).toBe(false);
  });
});

describe('computeStats — byLocation aggregation', () => {
  it('aggregates kWh and cost across multiple sessions at the same location', () => {
    const home = makeLocation({ id: 'home', name: 'Home', color: '#abc' });
    const sessions = [
      makeSession({ id: 'a', locationId: 'home', energyKwh: 10, costCents: 100 }),
      makeSession({ id: 'b', locationId: 'home', energyKwh: 15, costCents: 250 })
    ];

    const stats = computeStats(
      sessions,
      locationMap([home]),
      sessions,
      vehicleMap([VEHICLE_300_RANGE]),
      null
    );

    expect(stats.byLocation).toEqual([
      { locationId: 'home', name: 'Home', color: '#abc', totalKwh: 25, totalCostCents: 350 }
    ]);
  });

  it('falls back to "Unknown" and the default purple color when the location is missing', () => {
    const sessions = [makeSession({ id: 'a', locationId: 'orphan' })];

    const stats = computeStats(
      sessions,
      locationMap([]),
      sessions,
      vehicleMap([VEHICLE_300_RANGE]),
      null
    );

    expect(stats.byLocation).toEqual([
      expect.objectContaining({ name: 'Unknown', color: LOCATION_COLOR_HEX.purple })
    ]);
  });
});
