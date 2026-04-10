import { useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useImmerState } from '../../hooks/useImmerState';
import { FormFooter } from '../../components/FormFooter';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingNavigationButtons } from './OnboardingNavigationButtons';
import { GasComparisonForm, type GasComparisonFormData } from '../settings/GasComparisonForm';
import { DEFAULT_GAS_PRICE_CENTS, DEFAULT_COMPARISON_MPG, DEFAULT_MI_PER_KWH } from '../../constants';

type Step4State = GasComparisonFormData & {
  isInitialized: boolean;
  isLoading: boolean;
  error: string;
};

const DEFAULT_STATE: Step4State = {
  gasPriceStr: (DEFAULT_GAS_PRICE_CENTS / 100).toFixed(2),
  comparisonMpgStr: `${DEFAULT_COMPARISON_MPG}`,
  defaultMiPerKwhStr: `${DEFAULT_MI_PER_KWH}`,
  isInitialized: false,
  isLoading: false,
  error: ''
};

type OnboardingStep4GasComparisonProps = {
  onBack: () => void;
  onContinue: () => Promise<void>;
};

export function OnboardingStep4GasComparison(props: OnboardingStep4GasComparisonProps) {
  const { getSettings, updateSettings } = useSettings();
  const [state, setState] = useImmerState<Step4State>(DEFAULT_STATE);

  useEffect(() => {
    if (state.isInitialized) return;

    const load = async () => {
      const result = await getSettings();

      if (!result.success || !result.data) {
        setState((draft) => {
          draft.isInitialized = true;
        });
        return;
      }

      // Prefer already-saved values over defaults for returning users
      const {
        gasPriceCents = DEFAULT_GAS_PRICE_CENTS,
        comparisonMpg = DEFAULT_COMPARISON_MPG,
        defaultMiPerKwh = DEFAULT_MI_PER_KWH
      } = result.data;

      setState((draft) => {
        draft.gasPriceStr = (gasPriceCents / 100).toFixed(2);
        draft.comparisonMpgStr = `${comparisonMpg}`;
        draft.defaultMiPerKwhStr = `${defaultMiPerKwh}`;
        draft.isInitialized = true;
      });
    };

    load();
  }, [state.isInitialized, getSettings, setState]);

  const handleFieldChange = (field: keyof GasComparisonFormData, value: string) => {
    setState((draft) => {
      draft[field] = value;
      draft.error = '';
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState((draft) => {
      draft.isLoading = true;
      draft.error = '';
    });

    const gasPriceCents = Math.round(+state.gasPriceStr * 100);
    const comparisonMpg = +state.comparisonMpgStr;
    const defaultMiPerKwh = +state.defaultMiPerKwhStr;

    const result = await updateSettings({ gasPriceCents, comparisonMpg, defaultMiPerKwh });

    if (!result.success) {
      setState((draft) => {
        draft.error = result.error || 'Failed to save gas comparison settings';
        draft.isLoading = false;
      });
      return;
    }

    await props.onContinue();
  };

  return (
    <div>
      <OnboardingHeader
        title="Set Gas Comparison"
        description="Compare your EV charging costs against a gas car. You can change these any time in Settings."
      />

      <GasComparisonForm
        id="onboarding-gas-comparison-form"
        formData={state}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        isLoading={state.isLoading}
        error={state.error}
      />

      <FormFooter>
        <OnboardingNavigationButtons
          onBack={props.onBack}
          continueLabel={state.isLoading ? 'Saving...' : 'Finish'}
          type="submit"
          form="onboarding-gas-comparison-form"
          disabled={state.isLoading}
        />
      </FormFooter>
    </div>
  );
}
