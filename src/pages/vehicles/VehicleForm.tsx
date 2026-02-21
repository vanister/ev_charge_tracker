import { Button } from '../../components/Button';
import type { VehicleFormData } from './vehicleHelpers';

type VehicleFormProps = {
  formData: VehicleFormData;
  onChange: (field: keyof VehicleFormData, value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  isLoading: boolean;
  error: string;
  submitLabel: string;
  cancelLabel?: string;
};

export function VehicleForm(props: VehicleFormProps) {
  return (
    <form onSubmit={props.onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-8 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="vehicle-year" className="block text-sm font-medium text-body mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            id="vehicle-year"
            type="number"
            min="1900"
            max="2100"
            required
            value={props.formData.year}
            onChange={(e) => props.onChange('year', e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
              text-body placeholder-body-tertiary focus:outline-none
              focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="2024"
            disabled={props.isLoading}
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="vehicle-make" className="block text-sm font-medium text-body mb-1">
            Make <span className="text-red-500">*</span>
          </label>
          <input
            id="vehicle-make"
            type="text"
            required
            value={props.formData.make}
            onChange={(e) => props.onChange('make', e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
              text-body placeholder-body-tertiary focus:outline-none
              focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Tesla"
            disabled={props.isLoading}
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="vehicle-model" className="block text-sm font-medium text-body mb-1">
            Model <span className="text-red-500">*</span>
          </label>
          <input
            id="vehicle-model"
            type="text"
            required
            value={props.formData.model}
            onChange={(e) => props.onChange('model', e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
              text-body placeholder-body-tertiary focus:outline-none
              focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Model 3"
            disabled={props.isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="vehicle-name" className="block text-sm font-medium text-body mb-1">
          Vehicle Name
        </label>
        <input
          id="vehicle-name"
          type="text"
          value={props.formData.name}
          onChange={(e) => props.onChange('name', e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-default rounded-lg
            text-body placeholder-body-tertiary focus:outline-none
            focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="My EV (optional)"
          disabled={props.isLoading}
        />
      </div>

      <div>
        <label htmlFor="vehicle-icon" className="block text-sm font-medium text-body mb-1">
          Icon
        </label>
        <input
          id="vehicle-icon"
          type="text"
          value={props.formData.icon}
          onChange={(e) => props.onChange('icon', e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-default rounded-lg
            text-body placeholder-body-tertiary focus:outline-none
            focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="🚗"
          disabled={props.isLoading}
        />
      </div>

      {props.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-500">{props.error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {props.onCancel && (
          <Button type="button" variant="secondary" onClick={props.onCancel} disabled={props.isLoading}>
            {props.cancelLabel || 'Cancel'}
          </Button>
        )}
        <Button type="submit" variant="primary" fullWidth={!props.onCancel} disabled={props.isLoading}>
          {props.isLoading ? 'Saving...' : props.submitLabel}
        </Button>
      </div>
    </form>
  );
}
