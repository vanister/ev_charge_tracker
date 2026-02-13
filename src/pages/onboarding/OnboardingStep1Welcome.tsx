import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingFooter } from './OnboardingFooter';
import { Button } from '../../components/Button';

type OnboardingStep1WelcomeProps = {
  onContinue: () => void;
};

export function OnboardingStep1Welcome(props: OnboardingStep1WelcomeProps) {
  return (
    <div className="text-center">
      <OnboardingHeader
        title="EV Charge Tracker"
        description="Track your electric vehicle charging sessions with ease."
        subDescription="Work completely offline, manage multiple vehicles, and analyze your charging costs across different locations."
      />

      <OnboardingFooter>
        <Button variant="primary" onClick={props.onContinue} fullWidth className="sm:w-auto">
          Get Started
        </Button>
      </OnboardingFooter>
    </div>
  );
}
