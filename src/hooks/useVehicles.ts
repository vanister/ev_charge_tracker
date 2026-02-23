import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import type { Vehicle } from '../data/data-types';
import { DEFAULT_VEHICLE_ICON } from '../data/constants';
import { generateId } from '../utilities/dataUtils';
import { success, failure, type Result } from '../utilities/resultUtils';

export type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'isActive'>;
export type UpdateVehicleInput = Partial<Omit<Vehicle, 'id' | 'createdAt'>>;

export function useVehicles() {
  const { db } = useDatabase();

  const getVehicleList = useCallback(
    async (activeOnly = true): Promise<Vehicle[]> => {
      if (activeOnly) {
        return db.vehicles.where('isActive').equals(1).sortBy('createdAt');
      }

      return db.vehicles.orderBy('createdAt').toArray();
    },
    [db]
  );

  const getVehicle = useCallback(
    async (id: string): Promise<Vehicle | undefined> => {
      return db.vehicles.get(id);
    },
    [db]
  );

  const createVehicle = async (input: CreateVehicleInput): Promise<Result<Vehicle>> => {
    const vehicle: Vehicle = {
      ...input,
      icon: input.icon ?? DEFAULT_VEHICLE_ICON,
      id: generateId(),
      createdAt: Date.now(),
      isActive: 1
    };

    try {
      await db.vehicles.add(vehicle);
      return success(vehicle);
    } catch (err) {
      console.error('Failed to create vehicle:', err);
      return failure('Failed to create vehicle');
    }
  };

  const updateVehicle = async (id: string, input: UpdateVehicleInput): Promise<Result<Vehicle>> => {
    try {
      const existing = await db.vehicles.get(id);

      if (!existing) {
        return failure('Vehicle not found');
      }

      const updated: Vehicle = { ...existing, ...input };

      await db.vehicles.put(updated);
      return success(updated);
    } catch (err) {
      console.error('Failed to update vehicle:', err);
      return failure('Failed to update vehicle');
    }
  };

  const deleteVehicle = async (id: string): Promise<Result<void>> => {
    try {
      const sessionCount = await db.sessions.where('vehicleId').equals(id).count();

      if (sessionCount > 0) {
        return failure(`Cannot delete vehicle with ${sessionCount} existing sessions`);
      }

      const result = await updateVehicle(id, { isActive: 0 });

      if (!result.success) {
        return failure(result.error);
      }

      return success(undefined);
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
      return failure('Failed to delete vehicle');
    }
  };

  return {
    getVehicleList,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}
