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
  const locations: Location[] = DEFAULT_LOCATIONS.map((template) => ({
    id: generateId(),
    name: template.name,
    icon: template.icon,
    color: template.color,
    defaultRate: template.defaultRate,
    createdAt: now,
    isActive: true
  }));

  await db.locations.bulkAdd(locations);
}

export function getDefaultSettings(): Settings {
  return { ...DEFAULT_SETTINGS };
}
