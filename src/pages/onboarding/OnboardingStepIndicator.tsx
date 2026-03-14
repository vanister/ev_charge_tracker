type OnboardingStepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export function OnboardingStepIndicator(props: OnboardingStepIndicatorProps) {
  return (
    <div className="bg-background border-default fixed top-0 right-0 left-0 z-10 border-b">
      <div className="mx-auto w-full max-w-2xl px-4 py-4">
        <p className="text-body-secondary text-center text-sm">
          Step {props.currentStep} of {props.totalSteps}
        </p>
      </div>
    </div>
  );
}
