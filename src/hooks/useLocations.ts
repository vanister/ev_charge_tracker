import { useLiveQuery } from 'dexie-react-hooks';
import { useDatabase } from './useDatabase';
import type { Location } from '../data/data-types';
import { generateId } from '../utilities/dataUtils';
import { success, failure, type Result } from '../utilities/resultUtils';

type NewLocation = Omit<Location, 'id' | 'createdAt' | 'isActive'>;
type UpdateLocation = Partial<Omit<Location, 'id' | 'createdAt'>>;

export function useLocations(activeOnly = true) {
  const { db } = useDatabase();

  // todo - apply the same pattern here as useSessions with explicit getLocationList and getLocation
  // functions instead of useLiveQuery in the hook, and then useLiveQuery in the components that need it.
  // This will give us more flexibility to fetch active vs all locations, and also to fetch a single
  // location by id when needed without having to fetch the entire list first
  const locations = useLiveQuery(async () => {
    if (activeOnly) {
      return await db.locations.where('isActive').equals(1).sortBy('createdAt');
    }

    return await db.locations.orderBy('createdAt').toArray();
  }, [activeOnly]);

  const createLocation = async (loc: NewLocation): Promise<Result<Location>> => {
    const location: Location = {
      ...loc,
      id: generateId(),
      createdAt: Date.now(),
      isActive: 1
    };

    try {
      await db.locations.add(location);
      return success(location);
    } catch (err) {
      console.error('Failed to create location:', err);
      return failure('Failed to create location');
    }
  };

  const updateLocation = async (id: string, loc: UpdateLocation): Promise<Result<Location>> => {
    try {
      const existing = await db.locations.get(id);

      if (!existing) {
        return failure('Location not found');
      }

      const updated: Location = { ...existing, ...loc };

      await db.locations.put(updated);
      return success(updated);
    } catch (err) {
      console.error('Failed to update location:', err);
      return failure('Failed to update location');
    }
  };

  const deleteLocation = async (id: string): Promise<Result<void>> => {
    try {
      const sessionCount = await db.sessions.where('locationId').equals(id).count();

      if (sessionCount > 0) {
        return failure(`Cannot delete location with ${sessionCount} existing sessions`);
      }

      const result = await updateLocation(id, { isActive: 0 });

      if (!result.success) {
        return failure(result.error);
      }

      return success(undefined);
    } catch (err) {
      console.error('Failed to delete location:', err);
      return failure('Failed to delete location');
    }
  };

  return {
    locations: locations ?? [],
    createLocation,
    updateLocation,
    deleteLocation
  };
}
