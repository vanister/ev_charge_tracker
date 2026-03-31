import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import type { ActiveState, LocationRecord } from '../data/data-types';
import { success, failure, type Result } from '../utilities/resultUtils';
import { generateId } from '../utilities/dataUtils';
import type { NewLocation } from '../pages/settings/locationHelpers';

type UpdateLocation = Partial<Omit<LocationRecord, 'id' | 'createdAt'>>;

export function useLocations() {
  const { db } = useDatabase();

  const getLocationList = useCallback(
    async (all = false): Promise<Result<LocationRecord[]>> => {
      try {
        const locations = all
          ? await db.locations.orderBy('order').toArray()
          : await db.locations.where('isActive').equals(1).sortBy('order');

        return success(locations);
      } catch (err) {
        console.error('Failed to get location list:', err);
        return failure('Failed to load locations');
      }
    },
    [db]
  );

  const getLocation = useCallback(
    async (id: string): Promise<Result<LocationRecord | undefined>> => {
      try {
        const location = await db.locations.get(id);
        return success(location);
      } catch (err) {
        console.error('Failed to get location:', err);
        return failure('Failed to load location');
      }
    },
    [db]
  );

  const createLocation = useCallback(
    async (loc: NewLocation): Promise<Result<LocationRecord>> => {
      const location: LocationRecord = {
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
    },
    [db]
  );

  const updateLocation = useCallback(
    async (id: string, loc: UpdateLocation): Promise<Result<LocationRecord>> => {
      try {
        const existing = await db.locations.get(id);

        if (!existing) {
          return failure('Location not found');
        }

        const updated: LocationRecord = { ...existing, ...loc };

        await db.locations.put(updated);
        return success(updated);
      } catch (err) {
        console.error('Failed to update location:', err);
        return failure('Failed to update location');
      }
    },
    [db]
  );

  const deleteLocation = useCallback(
    async (id: string): Promise<Result<void>> => {
      try {
        const sessionCount = await db.sessions.where('locationId').equals(id).count();

        if (sessionCount > 0) {
          return failure(`Cannot delete location with ${sessionCount} existing sessions`);
        }

        const result = await updateLocation(id, { isActive: 0 });

        if (!result.success) {
          return failure(result.error);
        }

        return success();
      } catch (err) {
        console.error('Failed to delete location:', err);
        return failure('Failed to delete location');
      }
    },
    [db, updateLocation]
  );

  return {
    getLocationList,
    getLocation,
    createLocation,
    updateLocation,
    deleteLocation
  };
}
