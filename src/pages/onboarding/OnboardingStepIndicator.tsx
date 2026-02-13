type OnboardingStepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export function OnboardingStepIndicator(props: OnboardingStepIndicatorProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-background border-b border-default">
      <div className="max-w-2xl w-full mx-auto px-4 py-4">
        <p className="text-sm text-body-secondary text-center">
          Step {props.currentStep} of {props.totalSteps}
        </p>
      </div>
    </div>
  );
}
