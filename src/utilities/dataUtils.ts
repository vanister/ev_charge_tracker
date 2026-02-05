import { DEFAULT_LOCATIONS, DEFAULT_SETTINGS, SETTINGS_KEY } from '../data/constants';
import type { EvChargTrackerDb, Location, Settings } from '../data/data-types';

export function generateId(generator: Crypto = crypto): string {
  return generator.randomUUID();
}

export async function seedDefaultLocations(db: EvChargTrackerDb): Promise<void> {
  const existingCount = await db.locations.count();

  if (existingCount > 0) {
    return;
  }

  const now = Date.now();
  const locations: Location[] = DEFAULT_LOCATIONS.map(({ name, color, icon, defaultRate }) => ({
    id: generateId(),
    name,
    icon,
    color,
    defaultRate,
    createdAt: now,
    isActive: 1
  }));

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
