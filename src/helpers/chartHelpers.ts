import { subDays, format, startOfDay } from 'date-fns';
import type { ChargingSession, Location } from '../data/data-types';
import type { ChartData, ChartDayData, LocationChartConfig } from '../pages/dashboard/chart-types';
import { LOCATION_COLOR_HEX } from '../constants';

export function buildChartData(
  sessions: ChargingSession[],
  locations: Location[],
  numDays: number = 31
): ChartData {
  const now = Date.now();
  const startTimestamp = startOfDay(subDays(now, numDays - 1)).getTime();

  // Generate all days in range, oldest first
  const days: ChartDayData[] = Array.from({ length: numDays }, (_, i) => {
    const date = subDays(now, numDays - 1 - i);
    const base: ChartDayData = {
      dateKey: format(date, 'yyyy-MM-dd'),
      label: format(date, 'MMM d')
    };
    for (const loc of locations) {
      base[loc.id] = 0;
    }
    return base;
  });

  // Index days by dateKey for O(1) lookup
  const dayIndex = new Map<string, ChartDayData>(days.map((d) => [d.dateKey, d]));

  // Aggregate session energy into the correct day/location bucket
  for (const session of sessions) {
    if (session.chargedAt < startTimestamp) {
      continue;
    }
    const dateKey = format(session.chargedAt, 'yyyy-MM-dd');
    const day = dayIndex.get(dateKey);
    if (day) {
      const current = (day[session.locationId] as number) ?? 0;
      day[session.locationId] = current + session.energyKwh;
    }
  }

  const locationConfigs: LocationChartConfig[] = locations.map((loc) => ({
    locationId: loc.id,
    name: loc.name,
    color: loc.color || LOCATION_COLOR_HEX.slate
  }));

  return { days, locationConfigs };
}
