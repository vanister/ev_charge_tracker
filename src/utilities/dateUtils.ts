import { format, isSameDay as dateFnsIsSameDay, startOfDay as dateFnsStartOfDay } from 'date-fns';

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
