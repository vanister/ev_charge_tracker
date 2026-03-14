import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import type { ChargingSession } from '../data/data-types';
import { success, failure, type Result } from '../utilities/resultUtils';
import { generateId } from '../utilities/dataUtils';

type SessionFilters = {
  vehicleId?: string;
  locationId?: string;
  dateRange?: {
    start: number;
    end: number;
  };
};

type CreateSessionInput = Omit<ChargingSession, 'id' | 'costCents'>;
type UpdateSessionInput = Partial<Omit<ChargingSession, 'id'>>;

export function useSessions() {
  const { db } = useDatabase();

  const getSessionList = useCallback(
    async (filters?: SessionFilters): Promise<Result<ChargingSession[]>> => {
      try {
        let query = db.sessions.orderBy('chargedAt');

        if (filters?.vehicleId && filters?.locationId) {
          const allSessions = await query.reverse().toArray();
          return success(
            allSessions.filter((s) => s.vehicleId === filters.vehicleId && s.locationId === filters.locationId)
          );
        }

        if (filters?.vehicleId) {
          query = db.sessions.where('vehicleId').equals(filters.vehicleId);
        } else if (filters?.locationId) {
          query = db.sessions.where('locationId').equals(filters.locationId);
        }

        let results = await query.reverse().toArray();

        if (filters?.dateRange) {
          results = results.filter(
            (s) => s.chargedAt >= filters.dateRange!.start && s.chargedAt <= filters.dateRange!.end
          );
        }

        return success(results);
      } catch (err) {
        console.error('Failed to get session list:', err);
        return failure('Failed to load sessions');
      }
    },
    [db]
  );

  const getSession = useCallback(
    async (id: string): Promise<Result<ChargingSession | undefined>> => {
      try {
        const session = await db.sessions.get(id);
        return success(session);
      } catch (err) {
        console.error('Failed to get session:', err);
        return failure('Failed to load session');
      }
    },
    [db]
  );

  const createSession = useCallback(
    async (input: CreateSessionInput): Promise<Result<ChargingSession>> => {
      const costCents = Math.round(input.energyKwh * input.ratePerKwh * 100);

      const session: ChargingSession = {
        ...input,
        id: generateId(),
        costCents
      };

      try {
        await db.sessions.add(session);
        return success(session);
      } catch (err) {
        console.error('Failed to create session:', err);
        return failure('Failed to create session');
      }
    },
    [db]
  );

  const updateSession = useCallback(
    async (id: string, input: UpdateSessionInput): Promise<Result<ChargingSession>> => {
      try {
        const existing = await db.sessions.get(id);

        if (!existing) {
          return failure('Session not found');
        }

        const energyKwh = input.energyKwh ?? existing.energyKwh;
        const ratePerKwh = input.ratePerKwh ?? existing.ratePerKwh;
        const costCents =
          input.energyKwh !== undefined || input.ratePerKwh !== undefined
            ? Math.round(energyKwh * ratePerKwh * 100)
            : existing.costCents;

        const updated: ChargingSession = {
          ...existing,
          ...input,
          costCents
        };

        await db.sessions.put(updated);
        return success(updated);
      } catch (err) {
        console.error('Failed to update session:', err);
        return failure('Failed to update session');
      }
    },
    [db]
  );

  const deleteSession = useCallback(
    async (id: string): Promise<Result<void>> => {
      try {
        await db.sessions.delete(id);
        return success();
      } catch (err) {
        console.error('Failed to delete session:', err);
        return failure('Failed to delete session');
      }
    },
    [db]
  );

  const hasAnySessions = useCallback(async (): Promise<Result<boolean>> => {
    try {
      const session = await db.sessions.limit(1).first();
      return success(session != null);
    } catch (err) {
      console.error('Failed to check for sessions:', err);
      return failure('Failed to check for sessions');
    }
  }, [db]);

  return {
    getSessionList,
    getSession,
    createSession,
    updateSession,
    deleteSession,
    hasAnySessions
  };
}
