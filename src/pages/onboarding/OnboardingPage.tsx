import { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { OnboardingStepIndicator } from './OnboardingStepIndicator';
import { OnboardingStep1Welcome } from './OnboardingStep1Welcome';
import { OnboardingStep2Locations } from './OnboardingStep2Locations';
import { OnboardingStep3Vehicle } from './OnboardingStep3Vehicle';
import { useNavigate } from 'react-router-dom';

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { completeOnboarding } = useSettings();
  const navigate = useNavigate();

  const handleComplete = async () => {
    await completeOnboarding();
    await navigate('/', { replace: true }); // Redirect to main app after onboarding
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <OnboardingStepIndicator currentStep={currentStep} totalSteps={3} />

      <div className="max-w-2xl w-full pt-16 pb-32">
        {/* Step 1: Welcome */}
        {currentStep === 1 && <OnboardingStep1Welcome onContinue={() => setCurrentStep(2)} />}

        {/* Step 2: Edit Location Rates */}
        {currentStep === 2 && (
          <OnboardingStep2Locations
            onBack={() => setCurrentStep(1)}
            onContinue={() => setCurrentStep(3)}
          />
        )}

        {/* Step 3: Create First Vehicle */}
        {currentStep === 3 && (
          <OnboardingStep3Vehicle onBack={() => setCurrentStep(2)} onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}
