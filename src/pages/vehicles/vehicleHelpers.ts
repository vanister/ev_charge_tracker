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

