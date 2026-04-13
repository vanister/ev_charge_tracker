import {
  subDays,
  startOfDay,
  getDateGroupKey,
  getMonthKey,
  formatChartDayLabel,
  formatMonthLabel,
  formatMonthLabelWithYear,
  startOfMonth,
  subMonths
} from '../utilities/dateUtils';
import type { ChargingSessionRecord, LocationRecord } from '../data/data-types';
import type { ChartData, ChartBarData, LocationChartConfig } from '../pages/dashboard/chart-types';
import { LOCATION_COLOR_HEX } from '../constants';
import type { TimeFilterValue } from '../types/shared-types';

// Cost keys are stored alongside energy keys so the tooltip can look them up
// from the raw bar payload without needing a separate data structure.
const costKey = (locationId: string) => `${locationId}__cost`;

export function buildChartData(
  sessions: ChargingSessionRecord[],
  locations: LocationRecord[],
  numDays: number = 31
): ChartData {
  const now = Date.now();
  const startTimestamp = startOfDay(subDays(now, numDays - 1));

  // Generate all days in range, oldest first
  const bars: ChartBarData[] = Array.from({ length: numDays }, (_, i) => {
    const date = subDays(now, numDays - 1 - i);
    const base: ChartBarData = {
      dateKey: getDateGroupKey(date),
      label: formatChartDayLabel(date)
    };

    for (const loc of locations) {
      base[loc.id] = 0;
      base[costKey(loc.id)] = 0;
    }

    return base;
  });

  // Index bars by dateKey for O(1) lookup
  const barIndex = new Map<string, ChartBarData>(bars.map((d) => [d.dateKey, d]));

  // Aggregate session energy and cost into the correct day/location bucket
  for (const session of sessions) {
    if (session.chargedAt < startTimestamp) {
      continue;
    }

    const dateKey = getDateGroupKey(session.chargedAt);
    const bar = barIndex.get(dateKey);

    if (bar) {
      bar[session.locationId] = ((bar[session.locationId] as number) ?? 0) + session.energyKwh;
      bar[costKey(session.locationId)] = ((bar[costKey(session.locationId)] as number) ?? 0) + session.costCents;
    }
  }

  const locationConfigs: LocationChartConfig[] = locations.map((loc) => ({
    locationId: loc.id,
    name: loc.name,
    color: loc.color || LOCATION_COLOR_HEX.slate
  }));

  // Aim for ~7 visible x-axis labels
  const xAxisInterval = Math.max(0, Math.floor(numDays / 7) - 1);

  return { bars, locationConfigs, xAxisInterval };
}

export function buildMonthlyChartData(
  sessions: ChargingSessionRecord[],
  locations: LocationRecord[],
  numMonths: number
): ChartData {
  const now = new Date();

  // Generate months oldest-first: numMonths ago → current month
  const bars: ChartBarData[] = Array.from({ length: numMonths }, (_, i) => {
    const monthDate = startOfMonth(subMonths(now, numMonths - 1 - i));
    const monthKey = getMonthKey(monthDate);
    // Show year only when it differs from the current year
    const label =
      monthDate.getFullYear() === now.getFullYear() ? formatMonthLabel(monthDate) : formatMonthLabelWithYear(monthDate);

    const base: ChartBarData = { dateKey: monthKey, label };

    for (const loc of locations) {
      base[loc.id] = 0;
      base[costKey(loc.id)] = 0;
    }

    return base;
  });

  const barIndex = new Map<string, ChartBarData>(bars.map((b) => [b.dateKey, b]));

  for (const session of sessions) {
    const monthKey = getMonthKey(session.chargedAt);
    const bar = barIndex.get(monthKey);

    if (bar) {
      bar[session.locationId] = ((bar[session.locationId] as number) ?? 0) + session.energyKwh;
      bar[costKey(session.locationId)] = ((bar[costKey(session.locationId)] as number) ?? 0) + session.costCents;
    }
  }

  const locationConfigs: LocationChartConfig[] = locations.map((loc) => ({
    locationId: loc.id,
    name: loc.name,
    color: loc.color || LOCATION_COLOR_HEX.slate
  }));

  // Monthly labels are wider; aim for ~5 visible labels to avoid overlap
  const xAxisInterval = Math.max(0, Math.floor(numMonths / 5) - 1);

  return { bars, locationConfigs, xAxisInterval };
}

export function getChartNumDays(timeRange: TimeFilterValue): number {
  switch (timeRange) {
    case '7d':
      return 7;
    case '14d':
      return 14;
    case '31d':
      return 31;
    default:
      return 90;
  }
}

export function getChartNumMonths(timeRange: TimeFilterValue, sessions: ChargingSessionRecord[]): number {
  if (timeRange === '3m') {
    return 3;
  }

  if (timeRange === '6m') {
    return 6;
  }

  if (timeRange === '12m') {
    return 12;
  }

  if (sessions.length === 0) {
    return 6;
  }

  const earliest = sessions.reduce((min, s) => Math.min(min, s.chargedAt), Infinity);
  const monthsElapsed = (Date.now() - earliest) / (1000 * 60 * 60 * 24 * 30.44) + 1;

  return Math.min(Math.ceil(monthsElapsed), 60);
}
