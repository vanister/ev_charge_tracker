import type { BackupReminderInterval } from '../constants';

export function formatBackupReminderInterval(interval: BackupReminderInterval): string {
  const days = +interval.replace('d', '');
  return days === 1 ? '1 day' : `${days} days`;
}

export function formatCost(costCents: number): string {
  const dollars = costCents / 100;
  const decimalPlaces = Math.abs(costCents) < 100_000 ? 2 : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(dollars);
}

export function formatEnergy(kwh: number, decimalPlaces: number = 1): string {
  return `${kwh.toFixed(decimalPlaces)} kWh`;
}

export function formatRate(ratePerKwh: number, decimalPlaces: number = 2): string {
  return `$${ratePerKwh.toFixed(decimalPlaces)}/kWh`;
}

export function formatMpge(mpge: number): string {
  return `${Math.round(mpge)} MPGe`;
}

export function formatBytes(bytes: number, decimalPlaces: number = 1): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(decimalPlaces)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(decimalPlaces)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(decimalPlaces)} GB`;
}
