import { z } from 'zod';
import { ALL_ICONS } from '../types/shared-types';

const ActiveStateSchema = z.union([z.literal(0), z.literal(1)]);

export const VehicleSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  make: z.string(),
  model: z.string(),
  year: z.number().int(),
  trim: z.string().optional(),
  batteryCapacity: z.number().optional(),
  range: z.number().optional(),
  notes: z.string().optional(),
  // Vehicle icons can be emojis or custom strings — not constrained to IconName
  icon: z.string(),
  createdAt: z.number(),
  isActive: ActiveStateSchema
});

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.enum(ALL_ICONS),
  color: z.string(),
  defaultRate: z.number(),
  createdAt: z.number(),
  isActive: ActiveStateSchema,
  order: z.number().optional()
});

export const ChargingSessionSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  locationId: z.string(),
  energyKwh: z.number(),
  ratePerKwh: z.number(),
  costCents: z.number(),
  chargedAt: z.number(),
  notes: z.string().optional()
});

export const SettingsSchema = z.object({
  key: z.literal('app-settings'),
  onboardingComplete: z.boolean()
});

const StoreExportSchema = z.discriminatedUnion('store', [
  z.object({ store: z.literal('vehicles'), records: z.array(VehicleSchema) }),
  z.object({ store: z.literal('sessions'), records: z.array(ChargingSessionSchema) }),
  z.object({ store: z.literal('locations'), records: z.array(LocationSchema) }),
  z.object({ store: z.literal('settings'), records: z.array(SettingsSchema) })
]);

export const BackupFileSchema = z.object({
  dbVersion: z.number().int().positive(),
  fileVersion: z.number().int().positive(),
  timestamp: z.number(),
  data: z.array(StoreExportSchema).length(4)
});
