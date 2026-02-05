import { OnboardingHeader } from './OnboardingHeader';

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

      <button
        onClick={props.onContinue}
        className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-lg font-medium
          hover:bg-primary/90 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}
