import type { MaintenanceType } from '../../constants';
import type { MaintenanceRecord, VehicleRecord } from '../../data/data-types';
import { getMonthKey, formatMonthGroupLabel } from '../../utilities/dateUtils';
import type { MaintenanceGroup } from './maintenance-types';

export function getMaintenanceTypeLabel(type: MaintenanceType): string {
  switch (type) {
    case 'tire_rotation':
      return 'Tire Rotation';
    case 'tire_replacement':
      return 'Tire Replacement';
    case 'brake_service':
      return 'Brake Service';
    case 'battery_service':
      return 'Battery Service';
    case 'software_update':
      return 'Software Update';
    case 'inspection':
      return 'Inspection';
    case 'cabin_filter':
      return 'Cabin Filter';
    case 'wiper_replacement':
      return 'Wiper Replacement';
    case 'coolant_service':
      return 'Coolant Service';
    default:
      return 'Other';
  }
}

export function sortRecords(records: MaintenanceRecord[]): MaintenanceRecord[] {
  return [...records].sort((a, b) => b.servicedAt - a.servicedAt);
}

export function groupRecordsByDate(records: MaintenanceRecord[]): MaintenanceGroup[] {
  const sorted = sortRecords(records);

  // yyyy-MM key preserves correct sort order when comparing month strings
  const grouped = sorted.reduce((map, record) => {
    const key = getMonthKey(record.servicedAt);
    const existing = map.get(key);

    if (existing) {
      existing.push(record);
    } else {
      map.set(key, [record]);
    }

    return map;
  }, new Map<string, MaintenanceRecord[]>());

  return Array.from(grouped.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, recs]) => {
      // Construct local-time date to avoid UTC parsing shifting the month back by one day
      const [year, month] = key.split('-').map(Number);
      return {
        label: formatMonthGroupLabel(new Date(year, month - 1, 1)),
        records: recs
      };
    });
}

export function withVehicleQuery(path: string, vehicleId?: string | null): string {
  return vehicleId ? `${path}?vehicleId=${encodeURIComponent(vehicleId)}` : path;
}

// A stale or missing vehicle id falls back to showing all vehicles
export function resolveVehicleFilter(
  activeVehicles: VehicleRecord[],
  candidateId?: string | null
): string | undefined {
  if (activeVehicles.length <= 1 || !candidateId) {
    return undefined;
  }

  return activeVehicles.some((v) => v.id === candidateId) ? candidateId : undefined;
}

export function filterRecordsByVehicle(
  records: MaintenanceRecord[],
  vehicleId?: string
): MaintenanceRecord[] {
  return vehicleId ? records.filter((r) => r.vehicleId === vehicleId) : records;
}
