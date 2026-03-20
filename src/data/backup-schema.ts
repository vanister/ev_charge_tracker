import { z } from 'zod';
import { VehicleSchema, LocationSchema, ChargingSessionSchema, SettingsSchema, MaintenanceRecordSchema } from './schemas';

const StoreExportSchema = z.discriminatedUnion('store', [
  z.object({ store: z.literal('vehicles'), records: z.array(VehicleSchema) }),
  z.object({ store: z.literal('sessions'), records: z.array(ChargingSessionSchema) }),
  z.object({ store: z.literal('locations'), records: z.array(LocationSchema) }),
  z.object({ store: z.literal('settings'), records: z.array(SettingsSchema) }),
  z.object({ store: z.literal('maintenanceRecords'), records: z.array(MaintenanceRecordSchema) })
]);

export const BackupFileSchema = z.object({
  dbVersion: z.number().int().positive(),
  fileVersion: z.number().int().positive(),
  timestamp: z.number(),
  // Preserved so restoring a backup also recovers the device's sync identity
  deviceId: z.string().optional(),
  data: z.array(StoreExportSchema).min(4)
});
