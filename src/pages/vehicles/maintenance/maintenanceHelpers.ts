import { format } from 'date-fns';
import type { MaintenanceType } from '../../../constants';
import type { MaintenanceRecord } from '../../../data/data-types';
import type { MaintenanceGroup } from './maintenance-types';

const TYPE_LABELS: Record<MaintenanceType, string> = {
  tire_rotation: 'Tire Rotation',
  tire_replacement: 'Tire Replacement',
  brake_service: 'Brake Service',
  battery_service: 'Battery Service',
  software_update: 'Software Update',
  inspection: 'Inspection',
  cabin_filter: 'Cabin Filter',
  wiper_replacement: 'Wiper Replacement',
  coolant_service: 'Coolant Service',
  other: 'Other'
};

export function createTypeLabel(type: MaintenanceType): string {
  return TYPE_LABELS[type];
}

export function sortRecords(records: MaintenanceRecord[]): MaintenanceRecord[] {
  return [...records].sort((a, b) => b.servicedAt - a.servicedAt);
}

export function groupRecordsByDate(records: MaintenanceRecord[]): MaintenanceGroup[] {
  const sorted = sortRecords(records);

  // yyyy-MM key preserves correct sort order when comparing month strings
  const grouped = sorted.reduce((map, record) => {
    const key = format(record.servicedAt, 'yyyy-MM');
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
    .map(([key, recs]) => ({
      label: format(new Date(`${key}-01`), 'MMMM yyyy'),
      records: recs
    }));
}
