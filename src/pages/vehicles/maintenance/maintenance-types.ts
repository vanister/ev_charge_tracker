import type { MaintenanceType } from '../../../constants';
import type { MaintenanceRecord } from '../../../data/data-types';

export type MaintenanceGroup = {
  label: string;
  records: MaintenanceRecord[];
};

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
