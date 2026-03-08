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

/**
 * @deprecated Named colors are no longer used. Locations now store hex values.
 * This map exists only to migrate legacy data on save.
 */
const DEPRECATED_NAMED_COLORS: Record<string, string> = {
  teal: LOCATION_COLOR_HEX.teal,
  slate: LOCATION_COLOR_HEX.slate,
  purple: LOCATION_COLOR_HEX.purple,
  orange: LOCATION_COLOR_HEX.orange
};

/** Converts a legacy named color (e.g. 'teal') to its hex equivalent. Returns the value unchanged if it is already hex. */
export function migrateColorToHex(color: string): string {
  return DEPRECATED_NAMED_COLORS[color] ?? color;
}
