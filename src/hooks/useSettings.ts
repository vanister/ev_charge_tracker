import { useLiveQuery } from 'dexie-react-hooks';
import { useDatabase } from './useDatabase';
import type { Settings } from '../data/data-types';
import { SETTINGS_KEY } from '../data/constants';
import { success, failure, type Result } from '../utilities/resultUtils';

export function useSettings() {
  const { db } = useDatabase();

  const settings = useLiveQuery(async () => {
    return db.settings.get(SETTINGS_KEY);
  });

  const updateSettings = async (
    updates: Partial<Omit<Settings, 'key'>>
  ): Promise<Result<Settings>> => {
    try {
      const current = await db.settings.get(SETTINGS_KEY);

      if (!current) {
        return failure('Settings not found');
      }

      const updated: Settings = {
        ...current,
        ...updates
      };

      await db.settings.put(updated);
      return success(updated);
    } catch (err) {
      console.error('Failed to update settings:', err);
      return failure('Failed to update settings');
    }
  };

  const completeOnboarding = async (): Promise<Result<Settings>> => {
    return updateSettings({ onboardingComplete: true });
  };

  return {
    settings,
    updateSettings,
    completeOnboarding
  };
}
