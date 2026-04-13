import { timestampToDatetimeLocal } from '../../utilities/dateUtils';

export function datetimeLocalToTimestamp(datetimeStr: string): number {
  return new Date(datetimeStr).getTime();
}

export function calculateCostCents(energyKwh: number, ratePerKwh: number): number {
  return Math.round(energyKwh * ratePerKwh * 100);
}

export function getDefaultDateTime(): string {
  return timestampToDatetimeLocal(Date.now());
}
