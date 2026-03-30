import { describe, it, expect } from 'vitest';
import { DEFAULT_MI_PER_KWH, KWH_PER_GALLON } from '../../src/constants';
import type { VehicleRecord, SettingsRecord } from '../../src/data/data-types';
import {
  getMiPerKwh,
  calcMpge,
  calcGasCostCents,
  computeGasComparison
} from '../../src/helpers/gasComparisonHelpers';

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

const makeSettings = (overrides: Partial<SettingsRecord> = {}): SettingsRecord => ({
  key: 'app-settings',
  onboardingComplete: true,
  backupReminderInterval: '3d',
  ...overrides
});

describe('getMiPerKwh', () => {
  it('derives mi/kWh from vehicle range and batteryCapacity when both are present', () => {
    const vehicle = makeVehicle({ range: 300, batteryCapacity: 100 });
    expect(getMiPerKwh(vehicle)).toBe(3);
  });

  it('uses provided defaultMiPerKwh when vehicle has no specs', () => {
    const vehicle = makeVehicle();
    expect(getMiPerKwh(vehicle, 3.5)).toBe(3.5);
  });

  it('falls back to DEFAULT_MI_PER_KWH when vehicle has no specs and no default provided', () => {
    expect(getMiPerKwh(makeVehicle())).toBe(DEFAULT_MI_PER_KWH);
  });

  it('falls back to DEFAULT_MI_PER_KWH when vehicle is null', () => {
    expect(getMiPerKwh(null)).toBe(DEFAULT_MI_PER_KWH);
  });

  it('falls back to DEFAULT_MI_PER_KWH when vehicle is undefined', () => {
    expect(getMiPerKwh(undefined)).toBe(DEFAULT_MI_PER_KWH);
  });

  it('falls back when only range is present', () => {
    const vehicle = makeVehicle({ range: 300 });
    expect(getMiPerKwh(vehicle, 2.5)).toBe(2.5);
  });

  it('falls back when only batteryCapacity is present', () => {
    const vehicle = makeVehicle({ batteryCapacity: 100 });
    expect(getMiPerKwh(vehicle, 2.5)).toBe(2.5);
  });
});

describe('calcMpge', () => {
  it('returns mi/kWh multiplied by KWH_PER_GALLON', () => {
    expect(calcMpge(1)).toBe(KWH_PER_GALLON);
  });

  it('2.7 mi/kWh yields ~91 MPGe', () => {
    expect(calcMpge(2.7)).toBeCloseTo(90.99, 1);
  });

  it('returns 0 for 0 mi/kWh', () => {
    expect(calcMpge(0)).toBe(0);
  });
});

describe('calcGasCostCents', () => {
  it('returns 0 when totalKwh is 0', () => {
    expect(calcGasCostCents(0, 3, 350, 40)).toBe(0);
  });

  it('returns 0 when comparisonMpg is 0', () => {
    expect(calcGasCostCents(10, 3, 350, 0)).toBe(0);
  });

  it('calculates equivalent gas cost and rounds to integer cents', () => {
    // 10 kWh * 3 mi/kWh = 30 miles; (30/40) * 350 = 262.5 → 263
    expect(calcGasCostCents(10, 3, 350, 40)).toBe(263);
  });

  it('rounds fractional cents', () => {
    // 1 kWh * 1 mi/kWh = 1 mile; (1/3) * 100 = 33.33... → 33
    expect(calcGasCostCents(1, 1, 100, 3)).toBe(33);
  });
});

describe('computeGasComparison', () => {
  it('returns null when gasPriceCents is not configured', () => {
    const settings = makeSettings({ comparisonMpg: 40 });
    expect(computeGasComparison(10, 500, null, settings)).toBeNull();
  });

  it('returns null when comparisonMpg is not configured', () => {
    const settings = makeSettings({ gasPriceCents: 350 });
    expect(computeGasComparison(10, 500, null, settings)).toBeNull();
  });

  it('returns null when neither setting is configured', () => {
    expect(computeGasComparison(10, 500, null, makeSettings())).toBeNull();
  });

  it('returns stats with positive savingsCents when EV is cheaper than gas', () => {
    // 100 kWh * 3 mi/kWh = 300 miles; (300/40) * 350 = 2625 gas cost
    // EV cost = 500 cents → savings = 2625 - 500 = 2125 (positive = EV wins)
    const settings = makeSettings({ gasPriceCents: 350, comparisonMpg: 40 });
    const vehicle = makeVehicle({ range: 300, batteryCapacity: 100 });
    const result = computeGasComparison(100, 500, vehicle, settings);

    expect(result).not.toBeNull();
    expect(result!.savingsCents).toBeGreaterThan(0);
  });

  it('returns stats with negative savingsCents when gas is cheaper than EV', () => {
    // Very cheap gas, very expensive EV charging
    const settings = makeSettings({ gasPriceCents: 100, comparisonMpg: 100 });
    const vehicle = makeVehicle({ range: 100, batteryCapacity: 100 }); // 1 mi/kWh
    // 10 kWh * 1 mi/kWh = 10 miles; (10/100) * 100 = 10 gas cost cents
    // EV cost = 5000 cents → savings = 10 - 5000 = -4990 (negative = gas wins)
    const result = computeGasComparison(10, 5000, vehicle, settings);

    expect(result).not.toBeNull();
    expect(result!.savingsCents).toBeLessThan(0);
  });

  it('uses defaultMiPerKwh from settings when vehicle has no specs', () => {
    const settings = makeSettings({ gasPriceCents: 350, comparisonMpg: 40, defaultMiPerKwh: 4 });
    const result = computeGasComparison(10, 500, null, settings);

    expect(result).not.toBeNull();
    expect(result!.miPerKwh).toBe(4);
  });

  it('derives miPerKwh from vehicle specs when available', () => {
    const settings = makeSettings({ gasPriceCents: 350, comparisonMpg: 40, defaultMiPerKwh: 2.7 });
    const vehicle = makeVehicle({ range: 400, batteryCapacity: 100 });
    const result = computeGasComparison(10, 500, vehicle, settings);

    expect(result).not.toBeNull();
    expect(result!.miPerKwh).toBe(4);
  });

  it('includes mpge in the result', () => {
    const settings = makeSettings({ gasPriceCents: 350, comparisonMpg: 40 });
    const vehicle = makeVehicle({ range: 270, batteryCapacity: 100 }); // 2.7 mi/kWh
    const result = computeGasComparison(10, 500, vehicle, settings);

    expect(result!.mpge).toBeCloseTo(90.99, 1);
  });
});
