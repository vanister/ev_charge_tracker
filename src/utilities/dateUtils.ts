import {
  format,
  formatDistanceToNow as dateFnsFormatDistanceToNow,
  isSameDay as dateFnsIsSameDay,
  startOfDay as dateFnsStartOfDay,
  startOfMonth as dateFnsStartOfMonth,
  subDays as dateFnsSubDays,
  subMonths as dateFnsSubMonths
} from 'date-fns';
import { DATE_INPUT_FORMAT } from '../constants';
import type { DateFormatValue, DateRange, DateTimeFormatPrefs, TimeFilterValue, TimeFormatValue } from '../types/shared-types';

export function detectIs24Hour(): boolean {
  const resolved = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions();
  return resolved.hourCycle === 'h23' || resolved.hourCycle === 'h24';
}

// Cached once at module load — system hour cycle is stable for the page lifetime
const SYSTEM_IS_24H = detectIs24Hour();
const SYSTEM_TIME_PATTERN = SYSTEM_IS_24H ? 'HH:mm' : 'h:mm a';

export function resolveDatePattern(pref?: DateFormatValue): string {
  switch (pref) {
    case 'us-short':
      return 'MM/dd/yyyy';
    case 'eu-short':
      return 'dd/MM/yyyy';
    case 'iso':
      return 'yyyy-MM-dd';
    case 'medium':
    default:
      return 'MMM dd, yyyy';
  }
}

export function resolveTimePattern(pref?: TimeFormatValue): string {
  switch (pref) {
    case '12h':
      return 'h:mm a';
    case '24h':
      return 'HH:mm';
    case '24h-seconds':
      return 'HH:mm:ss';
    case 'auto':
    default:
      return SYSTEM_TIME_PATTERN;
  }
}

export function getDateRangeForTimeFilter(value: TimeFilterValue, now = Date.now()): DateRange | undefined {
  const end = now;

  switch (value) {
    case '7d':
      return { start: dateFnsStartOfDay(dateFnsSubDays(end, 6)).getTime(), end };
    case '14d':
      return { start: dateFnsStartOfDay(dateFnsSubDays(end, 13)).getTime(), end };
    case '31d':
      return { start: dateFnsStartOfDay(dateFnsSubDays(end, 30)).getTime(), end };
    case '3m':
      return { start: dateFnsSubMonths(end, 3).getTime(), end };
    case '6m':
      return { start: dateFnsSubMonths(end, 6).getTime(), end };
    case '12m':
      return { start: dateFnsSubMonths(end, 12).getTime(), end };
    default:
      return undefined;
  }
}

export function formatDate(timestamp: Date | number, prefs?: DateTimeFormatPrefs): string {
  return format(timestamp, resolveDatePattern(prefs?.dateFormat));
}

export function formatDateTime(timestamp: number, prefs?: DateTimeFormatPrefs): string {
  return format(timestamp, `${resolveDatePattern(prefs?.dateFormat)} ${resolveTimePattern(prefs?.timeFormat)}`);
}

export function formatTime(timestamp: number, prefs?: DateTimeFormatPrefs): string {
  return format(timestamp, resolveTimePattern(prefs?.timeFormat));
}

export function formatDateGroupHeader(timestamp: number, prefs?: DateTimeFormatPrefs): string {
  return format(timestamp, `EEEE, ${resolveDatePattern(prefs?.dateFormat)}`);
}

export function getMonthKey(timestamp: Date | number): string {
  return format(timestamp, 'yyyy-MM');
}

export function formatMonthGroupLabel(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function formatChartDayLabel(timestamp: number): string {
  return format(timestamp, 'MM/dd');
}

export function formatMonthLabel(date: Date): string {
  return format(date, 'MMM');
}

export function formatMonthLabelWithYear(date: Date): string {
  return format(date, "MMM ''yy");
}

export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  return dateFnsIsSameDay(timestamp1, timestamp2);
}

export function startOfDay(timestamp: number): number {
  return dateFnsStartOfDay(timestamp).getTime();
}

export function subDays(timestamp: number, days: number): number {
  return dateFnsSubDays(timestamp, days).getTime();
}

export function getDateGroupKey(timestamp: number): string {
  return format(timestamp, DATE_INPUT_FORMAT);
}

export function startOfMonth(date: Date): Date {
  return dateFnsStartOfMonth(date);
}

export function subMonths(date: Date, months: number): Date {
  return dateFnsSubMonths(date, months);
}

export function formatDistanceToNow(timestamp: number): string {
  return dateFnsFormatDistanceToNow(timestamp, { addSuffix: true });
}

export function timestampToDatetimeLocal(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Parses a yyyy-MM-dd date input string as local midnight to avoid UTC shift
export function dateInputToTimestamp(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
}
