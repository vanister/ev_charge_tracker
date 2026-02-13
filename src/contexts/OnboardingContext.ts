import { createContext } from 'react';

export type OnboardingContextType = {
  currentStep: number;
  isLoading: boolean;
  error: string;
  moveBack: () => void;
  moveNext: (complete?: boolean) => Promise<void>;
  setError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
};

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);
