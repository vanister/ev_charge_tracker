import { FormInput } from '../../components/FormInput';
import { FormTextarea } from '../../components/FormTextarea';
import type { VehicleFormData } from './vehicleHelpers';

type VehicleFormProps = {
  id?: string;
  formData: VehicleFormData;
  onChange: (field: keyof VehicleFormData, value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string;
};

export function VehicleForm(props: VehicleFormProps) {
  return (
    <form id={props.id} onSubmit={props.onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-8 gap-4">
        <div className="sm:col-span-2">
          <FormInput
            id="vehicle-year"
            label="Year"
            type="number"
            min="1900"
            max="2100"
            required
            value={props.formData.year}
            onChange={(e) => props.onChange('year', e.target.value)}
            placeholder="2024"
            disabled={props.isLoading}
          />
        </div>

        <div className="sm:col-span-3">
          <FormInput
            id="vehicle-make"
            label="Make"
            type="text"
            required
            value={props.formData.make}
            onChange={(e) => props.onChange('make', e.target.value)}
            placeholder="Tesla"
            disabled={props.isLoading}
          />
        </div>

        <div className="sm:col-span-3">
          <FormInput
            id="vehicle-model"
            label="Model"
            type="text"
            required
            value={props.formData.model}
            onChange={(e) => props.onChange('model', e.target.value)}
            placeholder="Model 3"
            disabled={props.isLoading}
          />
        </div>
      </div>

      <FormInput
        id="vehicle-name"
        label="Vehicle Name"
        type="text"
        value={props.formData.name}
        onChange={(e) => props.onChange('name', e.target.value)}
        placeholder="My EV (optional)"
        disabled={props.isLoading}
      />

      <FormInput
        id="vehicle-trim"
        label="Trim"
        type="text"
        value={props.formData.trim}
        onChange={(e) => props.onChange('trim', e.target.value)}
        placeholder="Long Range (optional)"
        disabled={props.isLoading}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          id="vehicle-battery-capacity"
          label="Battery Capacity (kWh)"
          type="number"
          min="1"
          value={props.formData.batteryCapacity}
          onChange={(e) => props.onChange('batteryCapacity', e.target.value)}
          placeholder="75 (optional)"
          disabled={props.isLoading}
        />

        <FormInput
          id="vehicle-range"
          label="Range (mi)"
          type="number"
          min="1"
          value={props.formData.range}
          onChange={(e) => props.onChange('range', e.target.value)}
          placeholder="358 (optional)"
          disabled={props.isLoading}
        />
      </div>

      <FormTextarea
        id="vehicle-notes"
        label="Notes"
        value={props.formData.notes}
        onChange={(e) => props.onChange('notes', e.target.value)}
        placeholder="Any notes about this vehicle (optional)"
        maxLength={1000}
        rows={3}
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
