import { useLiveQuery } from 'dexie-react-hooks';
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

export function useSessions(filters?: SessionFilters) {
  const { db } = useDatabase();

  const sessions = useLiveQuery(async () => {
    let query = db.sessions.orderBy('chargedAt');

    if (filters?.vehicleId && filters?.locationId) {
      const allSessions = await query.reverse().toArray();
      return allSessions.filter(
        (s) => s.vehicleId === filters.vehicleId && s.locationId === filters.locationId
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

    return results;
  }, [filters]);

  const createSession = async (input: CreateSessionInput): Promise<Result<ChargingSession>> => {
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
  };

  const updateSession = async (
    id: string,
    input: UpdateSessionInput
  ): Promise<Result<ChargingSession>> => {
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
  };

  const deleteSession = async (id: string): Promise<Result<void>> => {
    try {
      await db.sessions.delete(id);
      return success(undefined);
    } catch (err) {
      console.error('Failed to delete session:', err);
      return failure('Failed to delete session');
    }
  };

  return {
    sessions: sessions ?? [],
    createSession,
    updateSession,
    deleteSession
  };
}
