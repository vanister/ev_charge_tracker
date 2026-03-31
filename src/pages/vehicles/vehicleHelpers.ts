import type { VehicleRecord } from '../../data/data-types';

export type VehicleFormData = {
  year: string;
  make: string;
  model: string;
  name: string;
  trim: string;
  batteryCapacity: string;
  range: string;
  notes: string;
};

export const DEFAULT_VEHICLE_FORM_DATA: VehicleFormData = {
  year: '',
  make: '',
  model: '',
  name: '',
  trim: '',
  batteryCapacity: '',
  range: '',
  notes: ''
};

export function getVehicleDisplayName(vehicle: VehicleRecord): string {
  return vehicle.name || `${vehicle.make} ${vehicle.model}`;
}
