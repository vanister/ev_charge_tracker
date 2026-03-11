import { z } from 'zod';
import { BackupFileSchema } from './backup-schema';

export const SyncFileSchema = BackupFileSchema.extend({
  deviceId: z.string().min(1)
});

export type SyncFile = z.infer<typeof SyncFileSchema>;
