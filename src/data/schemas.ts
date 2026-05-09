import { z } from 'zod';
import { ALL_ICONS } from '../types/shared-types';
import { BACKUP_REMINDER_INTERVALS, MAINTENANCE_TYPES, OAUTH_PROVIDERS } from '../constants';

const ActiveStateSchema = z.union([z.literal(0), z.literal(1)]);

const OAuthProviderSchema = z.enum(
  Object.keys(OAUTH_PROVIDERS) as [keyof typeof OAUTH_PROVIDERS, ...Array<keyof typeof OAUTH_PROVIDERS>]
);

export const VehicleRecordSchema = z.object({
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

export const LocationRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.enum(ALL_ICONS),
  color: z.string(),
  defaultRate: z.number(),
  createdAt: z.number(),
  isActive: ActiveStateSchema,
  order: z.number().optional()
});

export const ChargingSessionRecordSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  locationId: z.string(),
  energyKwh: z.number(),
  ratePerKwh: z.number(),
  costCents: z.number(),
  chargedAt: z.number(),
  notes: z.string().optional(),
  gasPriceCents: z.number().int().optional(),
  odometer: z.number().int().min(0).optional()
});

export const SettingsRecordSchema = z.object({
  key: z.literal('app-settings'),
  onboardingComplete: z.boolean(),
  backupReminderInterval: z.enum(BACKUP_REMINDER_INTERVALS).default('3d'),
  // used with backupReminderDismissedAt to determine when the next reminder is due
  lastBackupAt: z.number().optional(),
  // allows skipping a reminder cycle without performing a backup
  backupReminderDismissedAt: z.number().optional(),
  // epoch ms of the last notification or toast pushed — used to escalate to daily reminders
  lastNotificationPushedAt: z.number().optional(),
  // gas comparison settings — undefined until user configures them
  gasPriceCents: z.number().int().optional(),
  comparisonMpg: z.number().optional(),
  defaultMiPerKwh: z.number().optional(),
  // date & time display format — undefined falls back to defaults (medium date, auto time)
  dateFormat: z.enum(['medium', 'us-short', 'eu-short', 'iso']).optional(),
  timeFormat: z.enum(['auto', '12h', '24h', '24h-seconds']).optional()
});

export const MaintenanceRecordSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  type: z.enum(MAINTENANCE_TYPES),
  description: z.string().optional(),
  costCents: z.number().int().optional(),
  mileage: z.number().int().optional(),
  serviceProvider: z.string().optional(),
  servicedAt: z.number(),
  nextDueDate: z.number().optional(),
  nextDueMileage: z.number().int().optional(),
  notes: z.string().optional(),
  createdAt: z.number()
});

export const ProviderConfigRecordSchema = z.object({
  provider: OAuthProviderSchema,
  clientId: z.string()
});

export const OAuthTokensRecordSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number()
});

export const SystemConfigRecordSchema = z.object({
  key: z.literal('system-config'),
  oAuthSettings: z.record(OAuthProviderSchema, ProviderConfigRecordSchema),
  oauthTokens: z.record(OAuthProviderSchema, OAuthTokensRecordSchema).optional(),
  // Persisted device identifier included in sync file metadata
  deviceId: z.string().optional(),
  // Epoch ms of last successful sync — used by Transport module for diff-check
  lastSyncAt: z.number().optional()
});
