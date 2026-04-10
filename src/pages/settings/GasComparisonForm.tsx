import { FormInput } from '../../components/FormInput';

export type GasComparisonFormData = {
  gasPriceStr: string;
  comparisonMpgStr: string;
  defaultMiPerKwhStr: string;
};

type GasComparisonFormProps = {
  id?: string;
  formData: GasComparisonFormData;
  onChange: (field: keyof GasComparisonFormData, value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error?: string;
};

export function GasComparisonForm(props: GasComparisonFormProps) {
  return (
    <form id={props.id} onSubmit={props.onSubmit} className="space-y-4">
      <FormInput
        id="gas-comparison-price"
        label="Average Gas Price ($/gal)"
        type="number"
        step="0.01"
        min="0"
        placeholder="3.50"
        required
        value={props.formData.gasPriceStr}
        disabled={props.isLoading}
        onChange={(e) => props.onChange('gasPriceStr', e.target.value)}
      />
      <FormInput
        id="gas-comparison-target-mpg"
        label="Target MPG"
        type="number"
        step="1"
        min="1"
        placeholder="40"
        required
        value={props.formData.comparisonMpgStr}
        disabled={props.isLoading}
        onChange={(e) => props.onChange('comparisonMpgStr', e.target.value)}
      />
      <div>
        <FormInput
          id="gas-comparison-default-mi-per-kwh"
          label="Default mi/kWh"
          type="number"
          step="0.1"
          min="0.1"
          placeholder="2.7"
          required
          value={props.formData.defaultMiPerKwhStr}
          disabled={props.isLoading}
          onChange={(e) => props.onChange('defaultMiPerKwhStr', e.target.value)}
        />
        <p className="text-body-secondary mt-3 text-xs italic">
          Used as fallback when a vehicle doesn't have battery capacity and range set
        </p>
      </div>

      {props.error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm text-red-500">{props.error}</p>
        </div>
      )}
    </form>
  );
}
