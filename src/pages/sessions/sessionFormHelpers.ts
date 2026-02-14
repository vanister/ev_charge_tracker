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

type SessionFormData = {
  vehicleId: string;
  locationId: string;
  energyKwh: number;
  ratePerKwh: number;
  chargedAt: number;
  notes: string;
};

export function buildSessionInput(formData: SessionFormData) {
  const input: {
    vehicleId: string;
    locationId: string;
    energyKwh: number;
    ratePerKwh: number;
    chargedAt: number;
    notes?: string;
  } = {
    vehicleId: formData.vehicleId,
    locationId: formData.locationId,
    energyKwh: formData.energyKwh,
    ratePerKwh: formData.ratePerKwh,
    chargedAt: formData.chargedAt
  };

  if (formData.notes.trim()) {
    input.notes = formData.notes.trim();
  }

  return input;
}
