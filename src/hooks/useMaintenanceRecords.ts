import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import type { MaintenanceRecord } from '../data/data-types';
import { success, failure, type Result } from '../utilities/resultUtils';
import { generateId } from '../utilities/dataUtils';

type CreateMaintenanceRecordInput = Omit<MaintenanceRecord, 'id' | 'createdAt'>;
type UpdateMaintenanceRecordInput = Partial<Omit<MaintenanceRecord, 'id' | 'createdAt'>>;

export function useMaintenanceRecords() {
  const { db } = useDatabase();

  const getMaintenanceRecordList = useCallback(
    async (vehicleId?: string): Promise<Result<MaintenanceRecord[]>> => {
      try {
        let results: MaintenanceRecord[];

        if (vehicleId) {
          results = await db.maintenanceRecords.where('vehicleId').equals(vehicleId).reverse().sortBy('performedAt');
        } else {
          results = await db.maintenanceRecords.orderBy('performedAt').reverse().toArray();
        }

        return success(results);
      } catch (err) {
        console.error('Failed to get maintenance record list:', err);
        return failure('Failed to load maintenance records');
      }
    },
    [db]
  );

  const getMaintenanceRecord = useCallback(
    async (id: string): Promise<Result<MaintenanceRecord | undefined>> => {
      try {
        const record = await db.maintenanceRecords.get(id);
        return success(record);
      } catch (err) {
        console.error('Failed to get maintenance record:', err);
        return failure('Failed to load maintenance record');
      }
    },
    [db]
  );

  const createMaintenanceRecord = useCallback(
    async (input: CreateMaintenanceRecordInput): Promise<Result<MaintenanceRecord>> => {
      const record: MaintenanceRecord = {
        ...input,
        id: generateId(),
        createdAt: Date.now()
      };

      try {
        await db.maintenanceRecords.add(record);
        return success(record);
      } catch (err) {
        console.error('Failed to create maintenance record:', err);
        return failure('Failed to create maintenance record');
      }
    },
    [db]
  );

  const updateMaintenanceRecord = useCallback(
    async (id: string, input: UpdateMaintenanceRecordInput): Promise<Result<MaintenanceRecord>> => {
      try {
        const existing = await db.maintenanceRecords.get(id);

        if (!existing) {
          return failure('Maintenance record not found');
        }

        const updated: MaintenanceRecord = { ...existing, ...input };
        await db.maintenanceRecords.put(updated);
        return success(updated);
      } catch (err) {
        console.error('Failed to update maintenance record:', err);
        return failure('Failed to update maintenance record');
      }
    },
    [db]
  );

  const deleteMaintenanceRecord = useCallback(
    async (id: string): Promise<Result<void>> => {
      try {
        await db.maintenanceRecords.delete(id);
        return success();
      } catch (err) {
        console.error('Failed to delete maintenance record:', err);
        return failure('Failed to delete maintenance record');
      }
    },
    [db]
  );

  return {
    getMaintenanceRecordList,
    getMaintenanceRecord,
    createMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord
  };
}
