import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useToast } from '../../hooks/useToast';
import { ButtonRow } from '../../components/ButtonRow';
import { Button } from '../../components/Button';

const RECENT_SESSIONS_LIMIT_OPTIONS = ['5', '10', '15', '25', '50', '100'] as const;

export function PreferencesSectionBody() {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();
  const { showToast } = useToast();

  const handleLimitChange = (value: string) => {
    updatePreferences({ recentSessionsLimit: +value });
    showToast({ message: 'Preferences saved', variant: 'success' });
  };

  const handleReset = () => {
    const confirmed = confirm(
      'Are you sure you want to reset all preferences to defaults? This will also clear your saved session filters.'
    );

    if (!confirmed) {
      return;
    }

    resetPreferences();
    showToast({ message: 'Preferences reset to defaults', variant: 'success' });
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
      <div className="flex justify-end">
        <Button variant="secondary" onClick={handleReset} className="w-32">
          Reset
        </Button>
      </div>
    </div>
  );
}
