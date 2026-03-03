import type { Vehicle } from '../../data/data-types';
import type { CreateVehicleInput } from './vehicle-types';

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

export function buildVehicleInput(formData: VehicleFormData): CreateVehicleInput {
  return {
    year: parseInt(formData.year, 10),
    make: formData.make.trim(),
    model: formData.model.trim(),
    name: formData.name.trim() || undefined,
    icon: '🚗'
  };
}
