import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import { success, failure } from '../utilities/resultUtils';
import type { Result } from '../types/shared-types';

export function useResetApp() {
  const { db } = useDatabase();

  const resetApp = useCallback(async (): Promise<Result<void>> => {
    try {
      const tables = [
        db.vehicles,
        db.sessions,
        db.locations,
        db.settings,
        db.systemConfig,
        db.maintenanceRecords
      ];

      await db.transaction('rw', tables, async () => {
        await Promise.all(tables.map((t) => t.clear()));
      });

      return success();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reset app data.';
      return failure(msg);
    }
  }, [db]);

  return { resetApp };
}
