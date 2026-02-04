type OnboardingStep1WelcomeProps = {
  onContinue: () => void;
};

export function OnboardingStep1Welcome(props: OnboardingStep1WelcomeProps) {
  return (
    <div className="text-center">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-body mb-4">EV Charge Tracker</h1>
        <p className="text-lg text-body-secondary mb-3">
          Track your electric vehicle charging sessions with ease.
        </p>
        <p className="text-base text-body-tertiary">
          Work completely offline, manage multiple vehicles, and analyze your charging costs across
          different locations.
        </p>
      </div>

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
