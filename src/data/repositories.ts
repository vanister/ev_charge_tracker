import { generateId } from '../utilities/dataUtils';
import { DEFAULT_LOCATIONS, DEFAULT_SETTINGS, SETTINGS_KEY } from './constants';
import type { ActiveState, EvChargTrackerDb, Location, Settings } from './data-types';

/******************************************************************************************
  Simple repository functions to abstract away direct db access from the rest of the app 
  These functions live outside of the standard hooks since they might be used outside of 
  the DatabaseProvider
 ******************************************************************************************/

export async function seedDefaultLocations(db: EvChargTrackerDb): Promise<void> {
  const existingCount = await db.locations.count();

  if (existingCount > 0) {
    return;
  }

  const now = Date.now();
  const locations: Location[] = DEFAULT_LOCATIONS.map(({ name, color, icon, defaultRate, order }) => ({
    id: generateId(),
    name,
    icon,
    color,
    defaultRate,
    createdAt: now,
    isActive: 1 as ActiveState,
    order
  })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  await db.locations.bulkPut(locations);
}

export async function loadSettings(db: EvChargTrackerDb): Promise<Settings> {
  const existingSettings = await db.settings.get(SETTINGS_KEY);

  if (existingSettings) {
    return existingSettings;
  }

  const defaultSettings = { ...DEFAULT_SETTINGS };
  await db.settings.add(defaultSettings);

  return defaultSettings;
}
