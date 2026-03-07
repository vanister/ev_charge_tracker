import { useNavigate } from 'react-router-dom';
import { OnboardingHeader } from './OnboardingHeader';
import { FormFooter } from '../../components/FormFooter';
import { Button } from '../../components/Button';
import { RestoreBackupButton } from '../../components/RestoreBackupButton';

type OnboardingStep1WelcomeProps = {
  onContinue: () => void;
};

export function OnboardingStep1Welcome(props: OnboardingStep1WelcomeProps) {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <OnboardingHeader
        title="EV Charge Tracker"
        description="Track your electric vehicle charging sessions with ease."
        subDescription="Work completely offline, manage multiple vehicles, and analyze your charging costs across different locations."
      />

      <FormFooter>
        <Button variant="primary" onClick={props.onContinue} fullWidth className="sm:w-auto">
          Get Started
        </Button>
      </FormFooter>

      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-body-secondary">or</p>
        <RestoreBackupButton
          label="Restore from backup"
          onSuccess={() => navigate('/', { replace: true })}
        />
      </div>
    </div>
  );
}
