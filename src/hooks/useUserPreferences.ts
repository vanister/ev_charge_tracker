import { useState, useCallback } from 'react';
import type { UserPreferences } from '../types/preference-types';
import { DEFAULT_PREFERENCES } from '../constants';
import { readPreferences, writePreferences, clearPreferences } from '../helpers/preferenceHelpers';

export function useUserPreferences(storage: Storage = localStorage) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => readPreferences(storage));

  const updatePreferences = useCallback(
    (partial: Partial<UserPreferences>) => {
      setPreferences((prev) => {
        const updated = { ...prev, ...partial };
        writePreferences(storage, updated);
        return updated;
      });
    },
    [storage]
  );

  const resetPreferences = useCallback(() => {
    clearPreferences(storage);
    setPreferences({ ...DEFAULT_PREFERENCES });
  }, [storage]);

  return { preferences, updatePreferences, resetPreferences };
}

