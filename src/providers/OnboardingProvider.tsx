import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingContext } from '../contexts/OnboardingContext';
import { useSettings } from '../hooks/useSettings';

type OnboardingProviderProps = {
  children: ReactNode;
};

export function OnboardingProvider(props: OnboardingProviderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { completeOnboarding } = useSettings();
  const navigate = useNavigate();

  const moveBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError('');
    }
  };

  const moveNext = async (complete?: boolean) => {
    if (!complete && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');
    await completeOnboarding();
    await navigate('/', { replace: true });
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        isLoading,
        error,
        moveBack,
        moveNext,
        setError,
        setIsLoading
      }}
    >
      {props.children}
    </OnboardingContext.Provider>
  );
}
