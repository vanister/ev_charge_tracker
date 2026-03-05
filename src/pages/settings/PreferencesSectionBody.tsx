import { useUserPreferences } from '../../hooks/useUserPreferences';
import { FormSelect } from '../../components/FormSelect';
import { Button } from '../../components/Button';

const LIMIT_OPTIONS = [
  { value: '3', text: '3' },
  { value: '5', text: '5' },
  { value: '10', text: '10' },
  { value: '15', text: '15' }
];

export function PreferencesSectionBody() {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ recentSessionsLimit: +e.target.value });
  };

  return (
    <div className="space-y-4">
      <FormSelect
        id="recent-sessions-limit"
        label="Recent sessions to show"
        value={`${preferences.recentSessionsLimit}`}
        options={LIMIT_OPTIONS}
        onChange={handleLimitChange}
      />
      <Button variant="secondary" onClick={resetPreferences}>
        Reset Preferences
      </Button>
    </div>
  );
}
