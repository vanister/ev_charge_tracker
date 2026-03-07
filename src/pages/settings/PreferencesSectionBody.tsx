import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useToast } from '../../hooks/useToast';
import { FormSelect } from '../../components/FormSelect';
import { Button } from '../../components/Button';

const RECENT_SESSIONS_LIMIT_OPTIONS = [
  { value: '5', text: '5' },
  { value: '10', text: '10' },
  { value: '15', text: '15' },
  { value: '25', text: '25' },
  { value: '50', text: '50' },
  { value: '100', text: '100' }
];

export function PreferencesSectionBody() {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();
  const { showToast } = useToast();

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ recentSessionsLimit: +e.target.value });
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
      <div className="flex items-center justify-between">
        <FormSelect
          id="recent-sessions-limit"
          label="Recent sessions to show"
          value={`${preferences.recentSessionsLimit}`}
          options={RECENT_SESSIONS_LIMIT_OPTIONS}
          onChange={handleLimitChange}
        />
        <Button variant="secondary" onClick={handleReset} className="w-32">
          Reset
        </Button>
      </div>
    </div>
  );
}
