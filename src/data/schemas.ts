import { z } from 'zod';
import { ALL_ICONS } from '../types/shared-types';
import { OAUTH_PROVIDERS } from '../constants';

const ActiveStateSchema = z.union([z.literal(0), z.literal(1)]);

const OAuthProviderSchema = z.enum(
  Object.keys(OAUTH_PROVIDERS) as [keyof typeof OAUTH_PROVIDERS, ...Array<keyof typeof OAUTH_PROVIDERS>]
);

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

export const ProviderConfigSchema = z.object({
  provider: OAuthProviderSchema,
  clientId: z.string()
});

export const OAuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number()
});

export const SystemConfigSchema = z.object({
  key: z.literal('system-config'),
  oAuthSettings: z.record(OAuthProviderSchema, ProviderConfigSchema),
  oauthTokens: z.record(OAuthProviderSchema, OAuthTokensSchema).optional(),
  // Persisted device identifier included in sync file metadata
  deviceId: z.string().optional(),
  // Epoch ms of last successful sync — used by Transport module for diff-check
  lastSyncAt: z.number().optional()
});
