import { timestampToDatetimeLocal } from '../../sessions/sessionFormHelpers';
import type { MaintenanceRecord } from '../../../data/data-types';
import type { MaintenanceFormData } from './maintenance-types';

export function buildRecord(formData: MaintenanceFormData, vehicleId: string): MaintenanceRecord {
  return {
    id: crypto.randomUUID(),
    vehicleId,
    type: formData.type,
    description: formData.description,
    servicedAt: new Date(formData.servicedAt).getTime(),
    costCents: formData.cost ? Math.round(+formData.cost * 100) : undefined,
    mileage: formData.mileage ? +formData.mileage : undefined,
    serviceProvider: formData.serviceProvider || undefined,
    nextDueDate: formData.nextDueDate ? new Date(formData.nextDueDate).getTime() : undefined,
    nextDueMileage: formData.nextDueMileage ? +formData.nextDueMileage : undefined,
    notes: formData.notes || undefined,
    createdAt: Date.now()
  };
}

export function getDefaultDateTime(): string {
  return timestampToDatetimeLocal(Date.now());
}
