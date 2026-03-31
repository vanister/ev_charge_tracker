import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../hooks/useSettings';
import { usePageConfig } from '../../hooks/usePageConfig';
import { useImmerState } from '../../hooks/useImmerState';
import { useToast } from '../../hooks/useToast';
import { FormInput } from '../../components/FormInput';
import { FormFooter } from '../../components/FormFooter';
import { Button } from '../../components/Button';

type GasComparisonDetailsState = {
  gasPriceStr: string;
  comparisonMpgStr: string;
  defaultMiPerKwhStr: string;
  isLoading: boolean;
  isInitialized: boolean;
};

const DEFAULT_STATE: GasComparisonDetailsState = {
  gasPriceStr: '',
  comparisonMpgStr: '',
  defaultMiPerKwhStr: '',
  isLoading: false,
  isInitialized: false
};

export function GasComparisonDetails() {
  usePageConfig('Gas Comparison', true);

  const navigate = useNavigate();
  const { getSettings, updateSettings } = useSettings();
  const { showToast } = useToast();
  const [formState, setFormState] = useImmerState<GasComparisonDetailsState>(DEFAULT_STATE);

  useEffect(() => {
    if (formState.isInitialized) return;

    const load = async () => {
      const result = await getSettings();

      if (!result.success || !result.data) {
        setFormState((draft) => {
          draft.isInitialized = true;
        });
        return;
      }

      const { gasPriceCents, comparisonMpg, defaultMiPerKwh } = result.data;
      setFormState((draft) => {
        draft.gasPriceStr = gasPriceCents != null ? (gasPriceCents / 100).toFixed(2) : '';
        draft.comparisonMpgStr = comparisonMpg != null ? `${comparisonMpg}` : '';
        draft.defaultMiPerKwhStr = defaultMiPerKwh != null ? `${defaultMiPerKwh}` : '';
        draft.isInitialized = true;
      });
    };

    load();
  }, [formState.isInitialized, getSettings, setFormState]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState((draft) => {
      draft.isLoading = true;
    });

    const gasPriceCents = formState.gasPriceStr ? Math.round(+formState.gasPriceStr * 100) : undefined;
    const comparisonMpg = formState.comparisonMpgStr ? +formState.comparisonMpgStr : undefined;
    const defaultMiPerKwh = formState.defaultMiPerKwhStr ? +formState.defaultMiPerKwhStr : undefined;

    const result = await updateSettings({ gasPriceCents, comparisonMpg, defaultMiPerKwh });

    if (!result.success) {
      setFormState((draft) => {
        draft.isLoading = false;
      });
      showToast({ message: 'Failed to save settings', variant: 'error' });
      return;
    }

    showToast({ message: 'Gas comparison settings saved', variant: 'success' });
    navigate('/settings');
  };

  const handleCancel = () => navigate('/settings');

  if (!formState.isInitialized) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-body-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-20">
      <form id="gas-comparison-form" onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="average-gas-price"
          label="Average Gas Price ($/gal)"
          type="number"
          step="0.01"
          min="0"
          placeholder="3.50"
          required
          value={formState.gasPriceStr}
          disabled={formState.isLoading}
          onChange={(e) =>
            setFormState((draft) => {
              draft.gasPriceStr = e.target.value;
            })
          }
        />
        <FormInput
          id="target-mpg"
          label="Target MPG"
          type="number"
          step="1"
          min="1"
          placeholder="40"
          required
          value={formState.comparisonMpgStr}
          disabled={formState.isLoading}
          onChange={(e) =>
            setFormState((draft) => {
              draft.comparisonMpgStr = e.target.value;
            })
          }
        />
        <div>
          <FormInput
            id="default-mi-per-kwh"
            label="Default mi/kWh"
            type="number"
            step="0.1"
            min="0.1"
            placeholder="2.7"
            required
            value={formState.defaultMiPerKwhStr}
            disabled={formState.isLoading}
            onChange={(e) =>
              setFormState((draft) => {
                draft.defaultMiPerKwhStr = e.target.value;
              })
            }
          />
          <p className="text-body-secondary mt-3 text-xs italic">
            Used as fallback when a vehicle doesn't have battery capacity and range set
          </p>
        </div>
      </form>

      <FormFooter>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={handleCancel} disabled={formState.isLoading}>
            Cancel
          </Button>
          <Button form="gas-comparison-form" type="submit" variant="primary" fullWidth disabled={formState.isLoading}>
            {formState.isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </FormFooter>
    </div>
  );
}
