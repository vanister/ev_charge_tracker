import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import type { VehicleRecord } from '../data/data-types';
import { generateId } from '../utilities/dataUtils';
import { success, failure, type Result } from '../utilities/resultUtils';
import type { CreateVehicleInput, UpdateVehicleInput } from '../pages/vehicles/vehicle-types';

export type { CreateVehicleInput, UpdateVehicleInput };

export function useVehicles() {
  const { db } = useDatabase();

  const getVehicleList = useCallback(
    async (activeOnly = true): Promise<Result<VehicleRecord[]>> => {
      try {
        if (activeOnly) {
          const vehicles = await db.vehicles.where('isActive').equals(1).sortBy('createdAt');
          return success(vehicles);
        }

        const vehicles = await db.vehicles.orderBy('createdAt').toArray();
        return success(vehicles);
      } catch (err) {
        console.error('Failed to get vehicle list:', err);
        return failure('Failed to load vehicles');
      }
    },
    [db]
  );

  const getVehicle = useCallback(
    async (id: string): Promise<Result<VehicleRecord | undefined>> => {
      try {
        const vehicle = await db.vehicles.get(id);
        return success(vehicle);
      } catch (err) {
        console.error('Failed to get vehicle:', err);
        return failure('Failed to load vehicle');
      }
    },
    [db]
  );

  const createVehicle = useCallback(
    async (input: CreateVehicleInput): Promise<Result<VehicleRecord>> => {
      const vehicle: VehicleRecord = {
        ...input,
        icon: '🚗',
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
    },
    [db]
  );

  const updateVehicle = useCallback(
    async (id: string, input: UpdateVehicleInput): Promise<Result<VehicleRecord>> => {
      try {
        const existing = await db.vehicles.get(id);

        if (!existing) {
          return failure('Vehicle not found');
        }

        const updated: VehicleRecord = { ...existing, ...input, icon: '🚗' };

        await db.vehicles.put(updated);
        return success(updated);
      } catch (err) {
        console.error('Failed to update vehicle:', err);
        return failure('Failed to update vehicle');
      }
    },
    [db]
  );

  const deleteVehicle = useCallback(
    async (id: string): Promise<Result<void>> => {
      try {
        const sessionCount = await db.sessions.where('vehicleId').equals(id).count();

        if (sessionCount > 0) {
          return failure(`Cannot delete vehicle with ${sessionCount} existing sessions`);
        }

        const result = await updateVehicle(id, { isActive: 0 });

        if (!result.success) {
          return failure(result.error);
        }

        return success();
      } catch (err) {
        console.error('Failed to delete vehicle:', err);
        return failure('Failed to delete vehicle');
      }
    },
    [db, updateVehicle]
  );

  return {
    getVehicleList,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}
