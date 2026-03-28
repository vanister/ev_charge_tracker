import type { MaintenanceType } from '../../../constants';
import type { MaintenanceRecord } from '../../../data/data-types';
import { formatDate } from '../../../utilities/dateUtils';
import type { MaintenanceGroup } from './maintenance-types';

export function createTypeLabel(type: MaintenanceType): string {
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
    const key = formatDate(record.servicedAt, 'yyyy-MM');
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
        label: formatDate(new Date(year, month - 1, 1), 'MMMM yyyy'),
        records: recs
      };
    });
}
