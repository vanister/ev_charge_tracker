import type { Location } from '../../data/data-types';
import { LOCATION_COLOR_HEX } from '../../constants';

export type LocationFormData = {
  name: string;
  icon: string;
  color: string;
  defaultRate: string;
};

export const DEFAULT_LOCATION_FORM_DATA: LocationFormData = {
  name: '',
  icon: 'map-pin',
  color: LOCATION_COLOR_HEX.teal,
  defaultRate: ''
};

export type NewLocation = Omit<Location, 'id' | 'createdAt' | 'isActive'>;
