import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../../hooks/useVehicles';
import { useSettings } from '../../hooks/useSettings';
import { OnboardingStep1Welcome } from './OnboardingStep1Welcome';
import { OnboardingStep2Locations } from './OnboardingStep2Locations';
import { OnboardingStep3Vehicle } from './OnboardingStep3Vehicle';

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { createVehicle } = useVehicles();
  const { completeOnboarding } = useSettings();

  async function handleVehicleComplete(vehicleData: {
    name?: string;
    make: string;
    model: string;
    year: number;
    icon: string;
  }) {
    const vehicleResult = await createVehicle(vehicleData);

    if (!vehicleResult.success) {
      return { success: false, error: vehicleResult.error || 'Failed to create vehicle' };
    }

    const onboardingResult = await completeOnboarding();

    if (!onboardingResult.success) {
      return { success: false, error: onboardingResult.error || 'Failed to complete onboarding' };
    }

    navigate('/', { replace: true });
    return { success: true };
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Step indicator */}
        <div className="mb-6">
          <p className="text-sm text-body-secondary text-center">Step {currentStep} of 3</p>
        </div>

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
          <OnboardingStep3Vehicle
            onBack={() => setCurrentStep(2)}
            onComplete={handleVehicleComplete}
          />
        )}
      </div>
    </div>
  );
}
