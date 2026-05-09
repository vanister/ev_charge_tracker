import {
  KWH_PER_GALLON,
  DEFAULT_MI_PER_KWH,
  DEFAULT_GAS_PRICE_CENTS,
  DEFAULT_GAS_SAVINGS_THRESHOLD
} from '../constants';
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
  let gasPriceTotalCents = 0;

  for (const session of sessions) {
    const sessionGasPriceCents = session.gasPriceCents ?? settingsGasPriceCents ?? DEFAULT_GAS_PRICE_CENTS;
    gasCostCents += calcGasCostCents(session.energyKwh, miPerKwh, sessionGasPriceCents, comparisonMpg);
    totalCostCents += session.costCents;
    gasPriceTotalCents += sessionGasPriceCents;
  }

  const savingsCents = gasCostCents - totalCostCents;
  const avgGasPriceCents = sessions.length > 0 ? Math.round(gasPriceTotalCents / sessions.length) : 0;
  const threshold = settings.gasSavingsThreshold ?? DEFAULT_GAS_SAVINGS_THRESHOLD;
  const isGasMateriallyCheaper = computeIsGasMateriallyCheaper(gasCostCents, savingsCents, threshold);

  return { miPerKwh, mpge, gasCostCents, savingsCents, avgGasPriceCents, isGasMateriallyCheaper };
}

// Returns true only when gas would have been more than the threshold fraction
// cheaper than the actual EV cost. Small gaps aren't meaningful to surface.
export function computeIsGasMateriallyCheaper(
  gasCostCents: number,
  savingsCents: number,
  threshold: number
): boolean {
  if (gasCostCents <= 0 || savingsCents >= 0) {
    return false;
  }
  return Math.abs(savingsCents) / gasCostCents > threshold;
}
