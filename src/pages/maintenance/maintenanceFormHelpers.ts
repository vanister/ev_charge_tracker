import { getDateGroupKey, dateInputToTimestamp } from '../../utilities/dateUtils';
import type { MaintenanceRecord, VehicleRecord } from '../../data/data-types';
import type { MaintenanceFormData } from './maintenance-types';
import { getActiveVehicles } from './maintenanceHelpers';

export function buildRecord(formData: MaintenanceFormData): Omit<MaintenanceRecord, 'id' | 'createdAt'> {
  return {
    vehicleId: formData.vehicleId,
    type: formData.type,
    description: formData.description || undefined,
    servicedAt: dateInputToTimestamp(formData.servicedAt),
    costCents: formData.cost ? Math.round(+formData.cost * 100) : undefined,
    mileage: formData.mileage ? +formData.mileage : undefined,
    serviceProvider: formData.serviceProvider || undefined,
    nextDueDate: formData.nextDueDate ? dateInputToTimestamp(formData.nextDueDate) : undefined,
    nextDueMileage: formData.nextDueMileage ? +formData.nextDueMileage : undefined,
    notes: formData.notes || undefined
  };
}

export function getDefaultDate(): string {
  return getDateGroupKey(Date.now());
}

// Keeps a soft-deleted vehicle selectable when editing a record that still references it
export function getSelectableVehicles(vehicles: VehicleRecord[], currentVehicleId: string): VehicleRecord[] {
  return vehicles.filter((v) => v.isActive === 1 || v.id === currentVehicleId);
}

export function getDefaultVehicleId(vehicles: VehicleRecord[], requestedVehicleId?: string | null): string {
  const activeVehicles = getActiveVehicles(vehicles);

  if (requestedVehicleId && activeVehicles.some((v) => v.id === requestedVehicleId)) {
    return requestedVehicleId;
  }

  return activeVehicles.length === 1 ? activeVehicles[0].id : '';
}
