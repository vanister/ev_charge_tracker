import { useEffect, useState } from 'react';
import { OnboardingHeader } from './OnboardingHeader';
import { FormFooter } from '../../components/FormFooter';
import { Button } from '../../components/Button';
import { RestoreBackupButton } from '../../components/RestoreBackupButton';
import { useSettings } from '../../hooks/useSettings';

type OnboardingStep1WelcomeProps = {
  onContinue: () => void;
};

export function OnboardingStep1Welcome(props: OnboardingStep1WelcomeProps) {
  const { getSettings } = useSettings();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await getSettings();
      if (result.success && result.data) {
        setOnboardingComplete(result.data.onboardingComplete);
      }
    }
    load();
  }, [getSettings]);

  return (
    <div className="text-center">
      <OnboardingHeader
        title="EV Charge Tracker"
        description="Track your electric vehicle charging sessions with ease."
        subDescription="Work completely offline, manage multiple vehicles, and analyze your charging costs across different locations."
      />

      <FormFooter>
        <Button variant="primary" onClick={props.onContinue} disabled={isRestoring} fullWidth className="sm:w-auto">
          Get Started
        </Button>
      </FormFooter>

      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-body-secondary">or</p>
        <RestoreBackupButton
          label="Restore from backup"
          skipConfirm={!onboardingComplete}
          onSuccess={() => window.location.replace('/')}
          onRestoreStart={() => setIsRestoring(true)}
          onError={(error) => { setIsRestoring(false); setRestoreError(error); }}
        />
        {restoreError && (
          <p className="text-sm text-red-600 dark:text-red-400">{restoreError}</p>
        )}
      </div>
    </div>
  );
}
