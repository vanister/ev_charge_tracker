import { Button } from '../../components/Button';
import { clsx } from 'clsx';

type OnboardingNavigationButtonsProps = {
  onBack?: () => void;
  continueLabel: string;
  continueType?: 'button' | 'submit';
  onContinue?: () => void;
  disabled?: boolean;
};

export function OnboardingNavigationButtons(props: OnboardingNavigationButtonsProps) {
  const { onBack, continueLabel, continueType = 'submit', onContinue, disabled = false } = props;

  return (
    <div className="flex justify-between gap-3">
      {onBack && (
        <Button variant="secondary" onClick={onBack} disabled={disabled}>
          Back
        </Button>
      )}
      <Button
        variant="primary"
        type={continueType}
        onClick={onContinue}
        disabled={disabled}
        className={clsx(!onBack && 'ml-auto')}
      >
        {continueLabel}
      </Button>
    </div>
  );
}
