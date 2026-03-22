import type { MaintenanceType } from '../../../constants';

export type MaintenanceFormData = {
  type: MaintenanceType;
  description: string;
  servicedAt: string;
  cost: string;
  mileage: string;
  serviceProvider: string;
  nextDueDate: string;
  nextDueMileage: string;
  notes: string;
};
