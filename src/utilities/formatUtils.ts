export function formatCost(costCents: number, decimalPlaces: number = 2): string {
  const dollars = costCents / 100;
  return `$${dollars.toFixed(decimalPlaces)}`;
}

export function formatEnergy(kwh: number, decimalPlaces: number = 1): string {
  return `${kwh.toFixed(decimalPlaces)} kWh`;
}

export function formatRate(ratePerKwh: number, decimalPlaces: number = 2): string {
  return `$${ratePerKwh.toFixed(decimalPlaces)}/kWh`;
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
