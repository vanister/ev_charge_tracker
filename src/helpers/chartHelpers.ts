import { subDays, format, startOfDay } from 'date-fns';
import type { ChargingSession, Location } from '../data/data-types';

export type ChartDayData = {
  dateKey: string;
  label: string;
  [locationId: string]: number | string;
};

export type LocationChartConfig = {
  locationId: string;
  name: string;
  color: string;
};

export type ChartData = {
  days: ChartDayData[];
  locationConfigs: LocationChartConfig[];
};

// Tailwind color hex values matching the CSS custom properties in index.css
const LOCATION_COLOR_HEX: Record<string, string> = {
  teal: '#14b8a6',   // teal-500
  slate: '#64748b',  // slate-500
  purple: '#c084fc', // purple-400
  orange: '#fb923c'  // orange-400
};

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
    if (session.chargedAt < startTimestamp) continue;
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
    color: LOCATION_COLOR_HEX[loc.color] ?? '#64748b'
  }));

  return { days, locationConfigs };
}
