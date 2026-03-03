import {
  format,
  isSameDay as dateFnsIsSameDay,
  startOfDay as dateFnsStartOfDay,
  subDays,
  subMonths
} from 'date-fns';

export function getDateRangeForTimeFilter(value: string): { start: number; end: number } | undefined {
  const end = Date.now();

  switch (value) {
    case '7d':
      return { start: subDays(end, 7).getTime(), end };
    case '14d':
      return { start: subDays(end, 14).getTime(), end };
    case '30d':
      return { start: subDays(end, 30).getTime(), end };
    case '3m':
      return { start: subMonths(end, 3).getTime(), end };
    case '6m':
      return { start: subMonths(end, 6).getTime(), end };
    case '12m':
      return { start: subMonths(end, 12).getTime(), end };
    default:
      return undefined;
  }
}

export function formatDate(timestamp: number, formatStr = 'MMM dd, yyyy'): string {
  return format(timestamp, formatStr);
}

export function formatDateTime(timestamp: number): string {
  return format(timestamp, 'MMM dd, yyyy h:mm a');
}

export function formatTime(timestamp: number): string {
  return format(timestamp, 'h:mm a');
}

export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  return dateFnsIsSameDay(timestamp1, timestamp2);
}

export function startOfDay(timestamp: number): number {
  return dateFnsStartOfDay(timestamp).getTime();
}

export function getDateGroupKey(timestamp: number): string {
  return format(timestamp, 'yyyy-MM-dd');
}
