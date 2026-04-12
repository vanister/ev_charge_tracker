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
import type { DateRange } from '../types/shared-types';
import type { TimeFilterValue } from '../types/shared-types';

// Resolve the runtime's default hour cycle once at module load. Passing `undefined`
// as the locale lets the browser pull OS-level region/time-format preferences, which
// `navigator.language` (the browser UI language) does not reflect.
const SYSTEM_IS_24H = detectIs24Hour();

const TIME_PATTERN = SYSTEM_IS_24H ? 'HH:mm' : 'h:mm a';
const DATE_PATTERN = 'MMM dd, yyyy';
const DATE_TIME_PATTERN = `${DATE_PATTERN} ${TIME_PATTERN}`;

export function detectIs24Hour(): boolean {
  const resolved = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions();
  return resolved.hourCycle === 'h23' || resolved.hourCycle === 'h24';
}

export function getDateRangeForTimeFilter(value: TimeFilterValue): DateRange | undefined {
  const end = Date.now();

  switch (value) {
    case '7d':
      return { start: dateFnsSubDays(end, 7).getTime(), end };
    case '14d':
      return { start: dateFnsSubDays(end, 14).getTime(), end };
    case '31d':
      return { start: dateFnsSubDays(end, 31).getTime(), end };
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

export function formatDate(timestamp: Date | number, formatStr = DATE_PATTERN): string {
  return format(timestamp, formatStr);
}

export function formatDateTime(timestamp: number): string {
  return format(timestamp, DATE_TIME_PATTERN);
}

export function formatTime(timestamp: number): string {
  return format(timestamp, TIME_PATTERN);
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
