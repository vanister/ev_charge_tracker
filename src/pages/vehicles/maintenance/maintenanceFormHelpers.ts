import { formatDate, dateInputToTimestamp } from '../../../utilities/dateUtils';
import { DATE_INPUT_FORMAT } from '../../../constants';
import type { MaintenanceRecord } from '../../../data/data-types';
import type { MaintenanceFormData } from './maintenance-types';

export function buildRecord(
  formData: MaintenanceFormData,
  vehicleId: string
): Omit<MaintenanceRecord, 'id' | 'createdAt'> {
  return {
    vehicleId,
    type: formData.type,
    description: formData.description,
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
  return formatDate(Date.now(), DATE_INPUT_FORMAT);
}
