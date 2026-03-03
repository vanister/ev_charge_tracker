export function timestampToDatetimeLocal(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function datetimeLocalToTimestamp(datetimeStr: string): number {
  return new Date(datetimeStr).getTime();
}

export function calculateCostCents(energyKwh: number, ratePerKwh: number): number {
  return Math.round(energyKwh * ratePerKwh * 100);
}

export function getDefaultDateTime(): string {
  return timestampToDatetimeLocal(Date.now());
}
