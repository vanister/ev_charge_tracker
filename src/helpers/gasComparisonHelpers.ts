import { KWH_PER_GALLON, DEFAULT_MI_PER_KWH, DEFAULT_GAS_PRICE_CENTS } from '../constants';
import type { ChargingSessionRecord, VehicleRecord, SettingsRecord } from '../data/data-types';
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
  sessions: ChargingSessionRecord[],
  vehicle: VehicleRecord | null | undefined,
  settings: SettingsRecord
): GasComparisonStats | null {
  const { comparisonMpg, defaultMiPerKwh, gasPriceCents: settingsGasPriceCents } = settings;

  if (comparisonMpg === undefined) {
    return null;
  }

  const miPerKwh = getMiPerKwh(vehicle, defaultMiPerKwh);
  const mpge = calcMpge(miPerKwh);

  let gasCostCents = 0;
  let totalCostCents = 0;

  for (const session of sessions) {
    const sessionGasPriceCents = session.gasPriceCents ?? settingsGasPriceCents ?? DEFAULT_GAS_PRICE_CENTS;
    gasCostCents += calcGasCostCents(session.energyKwh, miPerKwh, sessionGasPriceCents, comparisonMpg);
    totalCostCents += session.costCents;
  }

  const savingsCents = gasCostCents - totalCostCents;

  return { miPerKwh, mpge, gasCostCents, savingsCents };
}
