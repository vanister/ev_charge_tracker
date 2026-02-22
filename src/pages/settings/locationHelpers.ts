import type { IconName } from '../../components/Icon';
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
  color: 'teal',
  defaultRate: ''
};

export const LOCATION_ICON_OPTIONS: IconName[] = ['home', 'building', 'map-pin', 'zap', 'car'];

export const LOCATION_COLOR_OPTIONS: { value: string; label: string; bgClass: string }[] = [
  { value: 'teal', label: 'Teal', bgClass: 'bg-teal-500' },
  { value: 'slate', label: 'Slate', bgClass: 'bg-slate-500' },
  { value: 'purple', label: 'Purple', bgClass: 'bg-purple-400' },
  { value: 'orange', label: 'Orange', bgClass: 'bg-orange-400' }
];

type NewLocation = Omit<Location, 'id' | 'createdAt' | 'isActive'>;

export function buildLocationInput(formData: LocationFormData): NewLocation {
  return {
    name: formData.name.trim(),
    icon: (formData.icon as IconName) || 'map-pin',
    color: formData.color || 'teal',
    defaultRate: +formData.defaultRate || 0
  };
}
