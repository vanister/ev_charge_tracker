import { describe, it, expect } from 'vitest';
import type { MaintenanceRecord, VehicleRecord } from '../../../src/data/data-types';
import type { MaintenanceFormData } from '../../../src/pages/maintenance/maintenance-types';
import {
  buildRecord,
  getDefaultVehicleId,
  getSelectableVehicles
} from '../../../src/pages/maintenance/maintenanceFormHelpers';
import {
  filterRecordsByVehicle,
  resolveVehicleFilter,
  withVehicleQuery
} from '../../../src/pages/maintenance/maintenanceHelpers';

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

const makeRecord = (overrides: Partial<MaintenanceRecord> = {}): MaintenanceRecord => ({
  id: 'r1',
  vehicleId: 'v1',
  type: 'inspection',
  servicedAt: 0,
  createdAt: 0,
  ...overrides
});

const makeFormData = (overrides: Partial<MaintenanceFormData> = {}): MaintenanceFormData => ({
  vehicleId: 'v1',
  type: 'tire_rotation',
  description: '',
  servicedAt: '2026-03-15',
  cost: '',
  mileage: '',
  serviceProvider: '',
  nextDueDate: '',
  nextDueMileage: '',
  notes: '',
  ...overrides
});

const v1 = makeVehicle({ id: 'v1' });
const v2 = makeVehicle({ id: 'v2' });
const inactive = makeVehicle({ id: 'v3', isActive: 0 });

describe('buildRecord', () => {
  it('takes vehicleId from the form data', () => {
    const record = buildRecord(makeFormData({ vehicleId: 'v2' }));
    expect(record.vehicleId).toBe('v2');
  });

  it('converts cost to cents and leaves empty optional fields undefined', () => {
    const record = buildRecord(makeFormData({ cost: '12.345', mileage: '' }));
    expect(record.costCents).toBe(1235);
    expect(record.mileage).toBeUndefined();
    expect(record.description).toBeUndefined();
  });
});

describe('getDefaultVehicleId', () => {
  it('uses the requested vehicle when it is active', () => {
    expect(getDefaultVehicleId([v1, v2], 'v2')).toBe('v2');
  });

  it('ignores a requested vehicle that is inactive or unknown', () => {
    expect(getDefaultVehicleId([v1, v2, inactive], 'v3')).toBe('');
    expect(getDefaultVehicleId([v1, v2], 'missing')).toBe('');
  });

  it('falls back to the only active vehicle', () => {
    expect(getDefaultVehicleId([v1, inactive])).toBe('v1');
  });
});

describe('getSelectableVehicles', () => {
  it('returns active vehicles plus the current inactive one', () => {
    expect(getSelectableVehicles([v1, inactive], 'v3').map((v) => v.id)).toEqual(['v1', 'v3']);
    expect(getSelectableVehicles([v1, inactive], 'v1').map((v) => v.id)).toEqual(['v1']);
  });
});

describe('resolveVehicleFilter', () => {
  it('returns the candidate when it is an active vehicle and there are several', () => {
    expect(resolveVehicleFilter([v1, v2], 'v2')).toBe('v2');
  });

  it('returns undefined for stale ids, empty ids, or a single vehicle', () => {
    expect(resolveVehicleFilter([v1, v2], 'missing')).toBeUndefined();
    expect(resolveVehicleFilter([v1, v2], null)).toBeUndefined();
    expect(resolveVehicleFilter([v1], 'v1')).toBeUndefined();
  });
});

describe('filterRecordsByVehicle', () => {
  const records = [makeRecord({ id: 'a', vehicleId: 'v1' }), makeRecord({ id: 'b', vehicleId: 'v2' })];

  it('returns all records without a vehicle', () => {
    expect(filterRecordsByVehicle(records)).toHaveLength(2);
  });

  it('returns only the selected vehicle records', () => {
    expect(filterRecordsByVehicle(records, 'v2').map((r) => r.id)).toEqual(['b']);
  });
});

describe('withVehicleQuery', () => {
  it('appends the vehicle id when present', () => {
    expect(withVehicleQuery('/maintenance', 'v1')).toBe('/maintenance?vehicleId=v1');
    expect(withVehicleQuery('/maintenance', undefined)).toBe('/maintenance');
  });
});
