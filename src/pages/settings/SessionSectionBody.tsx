import { useUserPreferences } from '../../hooks/useUserPreferences';
import { ButtonRow } from '../../components/ButtonRow';

const RECENT_SESSIONS_LIMIT_OPTIONS = ['5', '10', '15', '25', '50', '100'] as const;

export function SessionSectionBody() {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleLimitChange = (value: string) => {
    updatePreferences({ recentSessionsLimit: +value });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <p className="text-body text-sm font-medium">Recent sessions to show</p>
        <ButtonRow
          options={RECENT_SESSIONS_LIMIT_OPTIONS}
          value={`${preferences.recentSessionsLimit}`}
          onChange={handleLimitChange}
        />
      </div>
    </div>
  );
}
