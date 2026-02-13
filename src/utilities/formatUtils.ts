export function formatCost(costCents: number): string {
  const dollars = costCents / 100;
  return `$${dollars.toFixed(2)}`;
}

export function formatEnergy(kwh: number): string {
  return `${kwh.toFixed(2)} kWh`;
}

export function formatRate(ratePerKwh: number): string {
  return `$${ratePerKwh.toFixed(3)}/kWh`;
}
