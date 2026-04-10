import { useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useImmerState } from '../../hooks/useImmerState';
import { FormInput } from '../../components/FormInput';
import { FormFooter } from '../../components/FormFooter';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingNavigationButtons } from './OnboardingNavigationButtons';
import { DEFAULT_GAS_PRICE_CENTS, DEFAULT_COMPARISON_MPG, DEFAULT_MI_PER_KWH } from '../../constants';

type Step4State = {
  gasPriceStr: string;
  comparisonMpgStr: string;
  defaultMiPerKwhStr: string;
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
      const { gasPriceCents, comparisonMpg, defaultMiPerKwh } = result.data;
      setState((draft) => {
        if (gasPriceCents != null) {
          draft.gasPriceStr = (gasPriceCents / 100).toFixed(2);
        }
        if (comparisonMpg != null) {
          draft.comparisonMpgStr = `${comparisonMpg}`;
        }
        if (defaultMiPerKwh != null) {
          draft.defaultMiPerKwhStr = `${defaultMiPerKwh}`;
        }
        draft.isInitialized = true;
      });
    };

    load();
  }, [state.isInitialized, getSettings, setState]);

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

      <form id="onboarding-gas-comparison-form" onSubmit={handleSubmit} className="mb-6 space-y-4">
        <FormInput
          id="onboarding-gas-price"
          label="Average Gas Price ($/gal)"
          type="number"
          step="0.01"
          min="0"
          placeholder="3.50"
          required
          value={state.gasPriceStr}
          disabled={state.isLoading}
          onChange={(e) =>
            setState((draft) => {
              draft.gasPriceStr = e.target.value;
              draft.error = '';
            })
          }
        />
        <FormInput
          id="onboarding-target-mpg"
          label="Target MPG"
          type="number"
          step="1"
          min="1"
          placeholder="40"
          required
          value={state.comparisonMpgStr}
          disabled={state.isLoading}
          onChange={(e) =>
            setState((draft) => {
              draft.comparisonMpgStr = e.target.value;
              draft.error = '';
            })
          }
        />
        <div>
          <FormInput
            id="onboarding-default-mi-per-kwh"
            label="Default mi/kWh"
            type="number"
            step="0.1"
            min="0.1"
            placeholder="2.7"
            required
            value={state.defaultMiPerKwhStr}
            disabled={state.isLoading}
            onChange={(e) =>
              setState((draft) => {
                draft.defaultMiPerKwhStr = e.target.value;
                draft.error = '';
              })
            }
          />
          <p className="text-body-secondary mt-3 text-xs italic">
            Used as fallback when a vehicle doesn't have battery capacity and range set
          </p>
        </div>
      </form>

      {state.error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm text-red-500">{state.error}</p>
        </div>
      )}

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
