import type { LocationRecord } from '../../data/data-types';
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
  color: LOCATION_COLOR_HEX.blue,
  defaultRate: ''
};

export type NewLocation = Omit<LocationRecord, 'id' | 'createdAt' | 'isActive'>;

// @deprecated Named colors are no longer used; this map exists only to migrate legacy data on save.
// The retired 'teal' name maps to the current blue, since teal is no longer part of the palette.
const DEPRECATED_NAMED_COLORS: Record<string, string> = {
  teal: LOCATION_COLOR_HEX.blue,
  blue: LOCATION_COLOR_HEX.blue,
  slate: LOCATION_COLOR_HEX.slate,
  purple: LOCATION_COLOR_HEX.purple,
  orange: LOCATION_COLOR_HEX.orange
};

export function migrateColorToHex(color: string): string {
  return DEPRECATED_NAMED_COLORS[color] ?? color;
}
