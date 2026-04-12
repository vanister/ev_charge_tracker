import { useCallback, useEffect, useState } from 'react';
import { useSettings } from './useSettings';
import type { Result } from '../types/shared-types';
import type { DateFormatValue, DateTimeFormatPrefs, TimeFormatValue } from '../types/shared-types';

export function useDateTimeFormat() {
  const { getSettings, updateSettings } = useSettings();
  const [prefs, setPrefs] = useState<DateTimeFormatPrefs>({});

  useEffect(() => {
    const load = async () => {
      const result = await getSettings();
      if (!result.success || !result.data) return;

      setPrefs({
        dateFormat: result.data.dateFormat,
        timeFormat: result.data.timeFormat
      });
    };

    load();
  }, [getSettings]);

  const updateDateFormat = useCallback(
    async (value: DateFormatValue): Promise<Result<boolean>> => {
      const result = await updateSettings({ dateFormat: value });
      if (result.success) {
        setPrefs((prev) => ({ ...prev, dateFormat: value }));
      }
      return result;
    },
    [updateSettings]
  );

  const updateTimeFormat = useCallback(
    async (value: TimeFormatValue): Promise<Result<boolean>> => {
      const result = await updateSettings({ timeFormat: value });
      if (result.success) {
        setPrefs((prev) => ({ ...prev, timeFormat: value }));
      }
      return result;
    },
    [updateSettings]
  );

  return { prefs, updateDateFormat, updateTimeFormat };
}
