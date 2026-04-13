import { KWH_PER_GALLON, DEFAULT_MI_PER_KWH } from '../constants';
import type { VehicleRecord, SettingsRecord } from '../data/data-types';
import type { GasComparisonStats } from '../pages/dashboard/dashboard-types';

export function getMiPerKwh(vehicle: VehicleRecord | null | undefined, defaultMiPerKwh?: number): number {
  if (!!vehicle?.range && !!vehicle?.batteryCapacity) {
    return vehicle.range / vehicle.batteryCapacity;
  }

  return defaultMiPerKwh ?? DEFAULT_MI_PER_KWH;
}

export function calcMpge(miPerKwh: number): number {
  return miPerKwh * KWH_PER_GALLON;
}

export function calcGasCostCents(
  totalKwh: number,
  miPerKwh: number,
  gasPriceCents: number,
  comparisonMpg: number
): number {
  if (comparisonMpg === 0 || totalKwh === 0) {
    return 0;
  }

  const miles = totalKwh * miPerKwh;
  return Math.round((miles / comparisonMpg) * gasPriceCents);
}

export function computeGasComparison(
  totalKwh: number,
  totalCostCents: number,
  vehicle: VehicleRecord | null | undefined,
  settings: SettingsRecord
): GasComparisonStats | null {
  const { gasPriceCents, comparisonMpg, defaultMiPerKwh } = settings;

  if (gasPriceCents === undefined || comparisonMpg === undefined) {
    return null;
  }

  const miPerKwh = getMiPerKwh(vehicle, defaultMiPerKwh);
  const mpge = calcMpge(miPerKwh);
  const gasCostCents = calcGasCostCents(totalKwh, miPerKwh, gasPriceCents, comparisonMpg);
  const savingsCents = gasCostCents - totalCostCents;

  return { miPerKwh, mpge, gasCostCents, savingsCents };
}
