import { useState, useCallback } from 'react';
import { USER_PREFERENCES_STORAGE_KEY, RECENT_SESSIONS_LIMIT } from '../constants';

export type UserPreferences = {
  lastVehicleId?: string;
  lastLocationId?: string;
  recentSessionsLimit: number;
};

const DEFAULT_PREFERENCES: UserPreferences = {
  recentSessionsLimit: RECENT_SESSIONS_LIMIT
};

function readPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(USER_PREFERENCES_STORAGE_KEY);

    if (!raw) {
      return { ...DEFAULT_PREFERENCES };
    }

    const parsed = JSON.parse(raw) as Partial<UserPreferences>;

    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

function writePreferences(prefs: UserPreferences): void {
  localStorage.setItem(USER_PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(readPreferences);

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...partial };
      writePreferences(updated);
      return updated;
    });
  }, []);

  const resetPreferences = useCallback(() => {
    localStorage.removeItem(USER_PREFERENCES_STORAGE_KEY);
    setPreferences({ ...DEFAULT_PREFERENCES });
  }, []);

  return { preferences, updatePreferences, resetPreferences };
}
