import type { Vehicle } from '../../data/data-types';

export type VehicleFormData = {
  year: string;
  make: string;
  model: string;
  name: string;
};

export const DEFAULT_VEHICLE_FORM_DATA: VehicleFormData = {
  year: '',
  make: '',
  model: '',
  name: ''
};

export function getVehicleDisplayName(vehicle: Vehicle): string {
  return vehicle.name || `${vehicle.make} ${vehicle.model}`;
}
