import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import type { ActiveState, Location } from '../data/data-types';
import { success, failure, type Result } from '../utilities/resultUtils';
import { generateId } from '../utilities/dataUtils';

type NewLocation = Omit<Location, 'id' | 'createdAt' | 'isActive'>;
type UpdateLocation = Partial<Omit<Location, 'id' | 'createdAt'>>;

export function useLocations() {
  const { db } = useDatabase();

  const getLocationList = useCallback(
    async (all = false): Promise<Location[]> => {
      if (all) {
        return db.locations.orderBy('order').toArray();
      }

      return db.locations.where('isActive').equals(1).sortBy('order');
    },
    [db]
  );

  const getLocation = useCallback(
    async (id: string): Promise<Location | undefined> => {
      return db.locations.get(id);
    },
    [db]
  );

  const createLocation = async (loc: NewLocation): Promise<Result<Location>> => {
    const location: Location = {
      ...loc,
      id: generateId(),
      createdAt: Date.now(),
      isActive: 1 as ActiveState
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
    getLocationList,
    getLocation,
    createLocation,
    updateLocation,
    deleteLocation
  };
}
