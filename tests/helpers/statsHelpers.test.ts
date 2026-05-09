import { describe, it, expect } from 'vitest';
import { DEFAULT_MI_PER_KWH } from '../../src/constants';
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
  color: '#fff',
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
  it('uses delta between consecutive odometer readings on the same vehicle', () => {
    const sessions = [
      makeSession({ id: 'a', chargedAt: 1, odometer: 1000 }),
      makeSession({ id: 'b', chargedAt: 2, odometer: 1150 })
    ];

    const stats = computeStats(
      sessions,
      locationMap([makeLocation()]),
      sessions,
      vehicleMap([VEHICLE_300_RANGE]),
      makeSettings()
    );

    // a: no prior → derived (10 kWh × 3 mi/kWh = 30); b: 1150 - 1000 = 150
    expect(stats.totalMiles).toBe(30 + 150);
    expect(stats.milesIncludeEstimates).toBe(true);
  });

  it('falls back to derived miles when a session has no odometer reading', () => {
    const sessions = [makeSession({ id: 'a', energyKwh: 20 })];

    const stats = computeStats(
      sessions,
      locationMap([makeLocation()]),
      sessions,
      vehicleMap([VEHICLE_300_RANGE]),
      makeSettings()
    );

    expect(stats.totalMiles).toBe(60);
    expect(stats.milesIncludeEstimates).toBe(true);
  });

  it('uses settings.defaultMiPerKwh when the vehicle has no range data', () => {
    const sessions = [makeSession({ id: 'a', energyKwh: 10 })];
    const plainVehicle = makeVehicle();

    const stats = computeStats(
      sessions,
      locationMap([makeLocation()]),
      sessions,
      vehicleMap([plainVehicle]),
      makeSettings({ defaultMiPerKwh: 4 })
    );

    expect(stats.totalMiles).toBe(40);
  });

  it('uses DEFAULT_MI_PER_KWH when neither vehicle data nor settings provide a value', () => {
    const sessions = [makeSession({ id: 'a', energyKwh: 10 })];
    const plainVehicle = makeVehicle();

    const stats = computeStats(
      sessions,
      locationMap([makeLocation()]),
      sessions,
      vehicleMap([plainVehicle]),
      null
    );

    expect(stats.totalMiles).toBe(10 * DEFAULT_MI_PER_KWH);
  });

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

  it('keeps deltas isolated per vehicle', () => {
    const v1 = makeVehicle({ id: 'v1', range: 300, batteryCapacity: 100 });
    const v2 = makeVehicle({ id: 'v2', range: 300, batteryCapacity: 100 });
    const sessions = [
      makeSession({ id: 'a', vehicleId: 'v1', chargedAt: 1, odometer: 1000 }),
      makeSession({ id: 'b', vehicleId: 'v2', chargedAt: 2, odometer: 5000 }),
      makeSession({ id: 'c', vehicleId: 'v1', chargedAt: 3, odometer: 1100 })
    ];

    const stats = computeStats(
      sessions,
      locationMap([makeLocation()]),
      sessions,
      vehicleMap([v1, v2]),
      makeSettings()
    );

    // a: derived 30; b: derived 30 (no v2 prior); c: 1100 - 1000 = 100 (v1 only)
    expect(stats.totalMiles).toBe(30 + 30 + 100);
  });

  it('returns zero totalMiles when there are no sessions', () => {
    const stats = computeStats(
      [],
      locationMap([]),
      [],
      vehicleMap([VEHICLE_300_RANGE]),
      makeSettings()
    );

    expect(stats.totalMiles).toBe(0);
    expect(stats.milesIncludeEstimates).toBe(false);
  });

  it('does not flag estimates when every filtered session has a usable odometer delta', () => {
    const sessions = [
      makeSession({ id: 'old', chargedAt: 1, odometer: 1000 }),
      makeSession({ id: 'a', chargedAt: 2, odometer: 1100 }),
      makeSession({ id: 'b', chargedAt: 3, odometer: 1250 })
    ];
    const filtered = [sessions[1], sessions[2]];

    const stats = computeStats(
      filtered,
      locationMap([makeLocation()]),
      sessions,
      vehicleMap([VEHICLE_300_RANGE]),
      makeSettings()
    );

    expect(stats.totalMiles).toBe(100 + 150);
    expect(stats.milesIncludeEstimates).toBe(false);
  });
});
