import { Icon } from '../../components/Icon';
import { FormInput } from '../../components/FormInput';
import type { IconName } from '../../types/shared-types';
import { LOCATION_ICON_OPTIONS, LOCATION_COLOR_OPTIONS } from '../../constants';
import type { LocationFormData } from './locationHelpers';

type LocationFormProps = {
  id?: string;
  formData: LocationFormData;
  onChange: (field: keyof LocationFormData, value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string;
};

export function LocationForm(props: LocationFormProps) {
  return (
    <form id={props.id} onSubmit={props.onSubmit} className="space-y-4">
      <FormInput
        id="location-name"
        label="Name"
        type="text"
        required
        value={props.formData.name}
        onChange={(e) => props.onChange('name', e.target.value)}
        placeholder="Home"
        disabled={props.isLoading}
      />

      <div>
        <span className="block text-sm font-medium text-body mb-2">Icon</span>
        <div className="flex gap-2">
          {LOCATION_ICON_OPTIONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => props.onChange('icon', icon)}
              disabled={props.isLoading}
              aria-label={icon}
              className={`p-3 rounded-lg border transition-colors ${
                props.formData.icon === icon
                  ? 'border-primary bg-primary/10 ring-2 ring-primary text-primary'
                  : 'border-default bg-surface text-body-secondary hover:border-default-hover hover:bg-background'
              }`}
            >
              <Icon name={icon as IconName} size="md" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-body mb-2">Color</span>
        <div className="flex gap-3">
          {LOCATION_COLOR_OPTIONS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => props.onChange('color', color.value)}
              disabled={props.isLoading}
              aria-label={color.label}
              className={`w-8 h-8 rounded-full ${color.bgClass} transition-transform ${
                props.formData.color === color.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
              }`}
            />
          ))}
        </div>
      </div>

      <FormInput
        id="location-rate"
        label="Default Rate ($/kWh)"
        type="number"
        required
        step="0.001"
        min="0"
        value={props.formData.defaultRate}
        onChange={(e) => props.onChange('defaultRate', e.target.value)}
        placeholder="0.000"
        disabled={props.isLoading}
      />

      {props.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-500">{props.error}</p>
        </div>
      )}
    </form>
  );
}
