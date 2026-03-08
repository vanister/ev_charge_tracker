import type { Location } from '../../data/data-types';

export type LocationFormData = {
  name: string;
  icon: string;
  color: string;
  defaultRate: string;
};

export const DEFAULT_LOCATION_FORM_DATA: LocationFormData = {
  name: '',
  icon: 'map-pin',
  color: '#14b8a6',
  defaultRate: ''
};

export type NewLocation = Omit<Location, 'id' | 'createdAt' | 'isActive'>;
