import { useLiveQuery } from 'dexie-react-hooks';
import { useDatabase } from './useDatabase';
import type { Vehicle } from '../data/data-types';
import { DEFAULT_VEHICLE_ICON } from '../data/constants';
import { generateId } from '../utilities/dataUtils';
import { success, failure, type Result } from '../utilities/resultUtils';

type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'isActive'>;
type UpdateVehicleInput = Partial<Omit<Vehicle, 'id' | 'createdAt'>>;

export function useVehicles(activeOnly = true) {
  const { db } = useDatabase();

  const vehicles = useLiveQuery(async () => {
    if (activeOnly) {
      return db.vehicles.where('isActive').equals(1).sortBy('createdAt');
    }

    return db.vehicles.orderBy('createdAt').toArray();
  }, [activeOnly]);

  async function createVehicle(input: CreateVehicleInput): Promise<Result<Vehicle>> {
    const vehicle: Vehicle = {
      ...input,
      icon: input.icon ?? DEFAULT_VEHICLE_ICON,
      id: generateId(),
      createdAt: Date.now(),
      isActive: true
    };

    try {
      await db.vehicles.add(vehicle);
      return success(vehicle);
    } catch (err) {
      console.error('Failed to create vehicle:', err);
      return failure('Failed to create vehicle');
    }
  }

  async function updateVehicle(id: string, input: UpdateVehicleInput): Promise<Result<Vehicle>> {
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
  }

  async function deleteVehicle(id: string): Promise<Result<void>> {
    try {
      const sessionCount = await db.sessions.where('vehicleId').equals(id).count();

      if (sessionCount > 0) {
        return failure(`Cannot delete vehicle with ${sessionCount} existing sessions`);
      }

      const result = await updateVehicle(id, { isActive: false });

      if (!result.success) {
        return failure(result.error);
      }

      return success(undefined);
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
      return failure('Failed to delete vehicle');
    }
  }

  return {
    vehicles: vehicles ?? [],
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}
