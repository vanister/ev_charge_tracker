import { Icon } from '../../components/Icon';
import type { IconName } from '../../components/Icon';
import { LOCATION_ICON_OPTIONS, LOCATION_COLOR_OPTIONS, type LocationFormData } from './locationHelpers';

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
      <div>
        <label htmlFor="location-name" className="block text-sm font-medium text-body mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="location-name"
          type="text"
          required
          value={props.formData.name}
          onChange={(e) => props.onChange('name', e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-default rounded-lg
            text-body placeholder-body-tertiary focus:outline-none
            focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Home"
          disabled={props.isLoading}
        />
      </div>

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

      <div>
        <label htmlFor="location-rate" className="block text-sm font-medium text-body mb-1">
          Default Rate ($/kWh) <span className="text-red-500">*</span>
        </label>
        <input
          id="location-rate"
          type="number"
          required
          step="0.001"
          min="0"
          value={props.formData.defaultRate}
          onChange={(e) => props.onChange('defaultRate', e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-default rounded-lg
            text-body placeholder-body-tertiary focus:outline-none
            focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="0.000"
          disabled={props.isLoading}
        />
      </div>

      {props.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-500">{props.error}</p>
        </div>
      )}
    </form>
  );
}
