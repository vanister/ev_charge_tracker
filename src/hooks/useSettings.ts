import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import type { SettingsRecord } from '../data/data-types';
import { SETTINGS_KEY } from '../data/constants';
import { success, failure, type Result } from '../utilities/resultUtils';

export function useSettings() {
  const { db } = useDatabase();

  const getSettings = useCallback(async (): Promise<Result<SettingsRecord | undefined>> => {
    try {
      const settings = await db.settings.get(SETTINGS_KEY);
      return success(settings);
    } catch (err) {
      console.error('Failed to get settings:', err);
      return failure('Failed to load settings');
    }
  }, [db]);

  const updateSettings = useCallback(
    async (updates: Partial<Omit<SettingsRecord, 'key'>>): Promise<Result<boolean>> => {
      try {
        await db.settings
          .where('key')
          .equals(SETTINGS_KEY)
          .modify((settings) => {
            // must mutate the existing object for Dexie to detect the change
            Object.assign(settings, updates);
          });

        return success(true);
      } catch (err) {
        console.error('Failed to update settings:', err);
        return failure('Failed to update settings');
      }
    },
    [db]
  );

  const completeOnboarding = useCallback(async (): Promise<void> => {
    // Set lastBackupAt so the backup reminder interval starts from onboarding completion,
    // not from epoch 0 (which would trigger an immediate reminder)
    await updateSettings({ onboardingComplete: true, lastBackupAt: Date.now() });
  }, [updateSettings]);

  return {
    getSettings,
    updateSettings,
    completeOnboarding
  };
}
