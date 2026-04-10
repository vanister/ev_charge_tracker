import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../hooks/useSettings';
import { usePageConfig } from '../../hooks/usePageConfig';
import { useImmerState } from '../../hooks/useImmerState';
import { useToast } from '../../hooks/useToast';
import { FormFooter } from '../../components/FormFooter';
import { Button } from '../../components/Button';
import {
  GasComparisonForm,
  DEFAULT_GAS_COMPARISON_FORM_DATA,
  type GasComparisonFormData
} from './GasComparisonForm';
import { DEFAULT_GAS_PRICE_CENTS, DEFAULT_COMPARISON_MPG, DEFAULT_MI_PER_KWH } from '../../constants';

type GasComparisonDetailsState = GasComparisonFormData & {
  isLoading: boolean;
  isInitialized: boolean;
};

const DEFAULT_STATE: GasComparisonDetailsState = {
  ...DEFAULT_GAS_COMPARISON_FORM_DATA,
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

      const {
        gasPriceCents = DEFAULT_GAS_PRICE_CENTS,
        comparisonMpg = DEFAULT_COMPARISON_MPG,
        defaultMiPerKwh = DEFAULT_MI_PER_KWH
      } = result.data;

      setFormState((draft) => {
        draft.gasPriceStr = (gasPriceCents / 100).toFixed(2);
        draft.comparisonMpgStr = `${comparisonMpg}`;
        draft.defaultMiPerKwhStr = `${defaultMiPerKwh}`;
        draft.isInitialized = true;
      });
    };

    load();
  }, [formState.isInitialized, getSettings, setFormState]);

  const handleFieldChange = (field: keyof GasComparisonFormData, value: string) => {
    setFormState((draft) => {
      draft[field] = value;
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState((draft) => {
      draft.isLoading = true;
    });

    const gasPriceCents = Math.round(+formState.gasPriceStr * 100);
    const comparisonMpg = +formState.comparisonMpgStr;
    const defaultMiPerKwh = +formState.defaultMiPerKwhStr;

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
      <GasComparisonForm
        id="gas-comparison-form"
        formData={formState}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        isLoading={formState.isLoading}
      />

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
