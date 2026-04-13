import { getDateGroupKey, dateInputToTimestamp } from '../../../utilities/dateUtils';
import type { MaintenanceRecord } from '../../../data/data-types';
import type { MaintenanceFormData } from './maintenance-types';

export function buildRecord(
  formData: MaintenanceFormData,
  vehicleId: string
): Omit<MaintenanceRecord, 'id' | 'createdAt'> {
  return {
    vehicleId,
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
