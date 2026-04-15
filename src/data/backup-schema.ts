import { z } from 'zod';
import {
  VehicleRecordSchema,
  LocationRecordSchema,
  ChargingSessionRecordSchema,
  SettingsRecordSchema,
  MaintenanceRecordSchema
} from './schemas';

const StoreExportSchema = z.discriminatedUnion('store', [
  z.object({ store: z.literal('vehicles'), records: z.array(VehicleRecordSchema) }),
  z.object({ store: z.literal('sessions'), records: z.array(ChargingSessionRecordSchema) }),
  z.object({ store: z.literal('locations'), records: z.array(LocationRecordSchema) }),
  z.object({ store: z.literal('settings'), records: z.array(SettingsRecordSchema) }),
  z.object({ store: z.literal('maintenanceRecords'), records: z.array(MaintenanceRecordSchema) })
]);

export const BackupFileSchema = z.object({
  dbVersion: z.number().int().positive(),
  fileVersion: z.number().int().positive(),
  timestamp: z.number(),
  // Preserved so restoring a backup also recovers the device's sync identity
  deviceId: z.string().optional(),
  data: z.array(StoreExportSchema).min(4),
  // Optional so older backup files without preferences remain valid
  preferences: z.object({ recentSessionsLimit: z.number().int().positive() }).optional()
});
