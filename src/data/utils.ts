import { DEFAULT_LOCATIONS, DEFAULT_SETTINGS } from './constants';
import type { EvChargTrackerDb, Location, Settings } from './data-types';

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
    isActive: true
  }));

  await db.locations.bulkPut(locations);
}

export function getDefaultSettings(): Settings {
  return { ...DEFAULT_SETTINGS };
}
