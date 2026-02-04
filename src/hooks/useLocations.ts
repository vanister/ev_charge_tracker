import { useLiveQuery } from 'dexie-react-hooks';
import { useDatabase } from './useDatabase';
import type { Location } from '../data/data-types';
import { generateId } from '../utilities/dataUtils';
import { success, failure, type Result } from '../utilities/resultUtils';

type CreateLocationInput = Omit<Location, 'id' | 'createdAt' | 'isActive'>;
type UpdateLocationInput = Partial<Omit<Location, 'id' | 'createdAt'>>;

export function useLocations(activeOnly = true) {
  const { db } = useDatabase();

  const locations = useLiveQuery(async () => {
    if (activeOnly) {
      return await db.locations.filter((loc) => loc.isActive).sortBy('createdAt');
    }

    return await db.locations.orderBy('createdAt').toArray();
  }, [activeOnly]);

  async function createLocation(input: CreateLocationInput): Promise<Result<Location>> {
    const location: Location = {
      ...input,
      id: generateId(),
      createdAt: Date.now(),
      isActive: true
    };

    try {
      await db.locations.add(location);
      return success(location);
    } catch (err) {
      console.error('Failed to create location:', err);
      return failure('Failed to create location');
    }
  }

  async function updateLocation(id: string, input: UpdateLocationInput): Promise<Result<Location>> {
    try {
      const existing = await db.locations.get(id);

      if (!existing) {
        return failure('Location not found');
      }

      const updated: Location = { ...existing, ...input };

      await db.locations.put(updated);
      return success(updated);
    } catch (err) {
      console.error('Failed to update location:', err);
      return failure('Failed to update location');
    }
  }

  async function deleteLocation(id: string): Promise<Result<void>> {
    try {
      const sessionCount = await db.sessions.where('locationId').equals(id).count();

      if (sessionCount > 0) {
        return failure(`Cannot delete location with ${sessionCount} existing sessions`);
      }

      const result = await updateLocation(id, { isActive: false });

      if (!result.success) {
        return failure(result.error);
      }

      return success(undefined);
    } catch (err) {
      console.error('Failed to delete location:', err);
      return failure('Failed to delete location');
    }
  }

  return {
    locations: locations ?? [],
    createLocation,
    updateLocation,
    deleteLocation
  };
}
