import type { UserPreferences } from '../types/preference-types';
import { USER_PREFERENCES_STORAGE_KEY, DEFAULT_PREFERENCES } from '../constants';

export function readPreferences(storage: Storage = localStorage): UserPreferences {
  try {
    const raw = storage.getItem(USER_PREFERENCES_STORAGE_KEY);

    if (!raw) {
      return { ...DEFAULT_PREFERENCES };
    }

    const parsed = JSON.parse(raw) as Partial<UserPreferences>;

    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function writePreferences(prefs: UserPreferences, storage: Storage = localStorage): void {
  storage.setItem(USER_PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
}

export function clearPreferences(storage: Storage = localStorage): void {
  storage.removeItem(USER_PREFERENCES_STORAGE_KEY);
}
