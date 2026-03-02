import { FormInput } from '../../components/FormInput';
import { FormTextarea } from '../../components/FormTextarea';
import { FormSelect } from '../../components/FormSelect';
import { formatCost } from '../../utilities/formatUtils';
import type { Vehicle, Location } from '../../data/data-types';
import { getVehicleDisplayName } from '../../helpers/sessionHelpers';

export type SessionFormData = {
  vehicleId: string;
  locationId: string;
  energyKwh: string;
  ratePerKwh: string;
  chargedAt: string;
  notes: string;
};

type SessionFormProps = {
  id?: string;
  formData: SessionFormData;
  onChange: (field: keyof SessionFormData, value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string;
  vehicles: Vehicle[];
  locations: Location[];
  calculatedCost: number;
};

export function SessionForm(props: SessionFormProps) {
  return (
    <form id={props.id} onSubmit={props.onSubmit} className="space-y-6">
      <FormSelect
        id="vehicle"
        label="Vehicle"
        required
        value={props.formData.vehicleId}
        onChange={(e) => props.onChange('vehicleId', e.target.value)}
        disabled={props.isLoading}
      >
        <option value="">Select a vehicle</option>
        {props.vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {getVehicleDisplayName(vehicle)}
          </option>
        ))}
      </FormSelect>

      <FormSelect
        id="location"
        label="Location"
        required
        value={props.formData.locationId}
        onChange={(e) => props.onChange('locationId', e.target.value)}
        disabled={props.isLoading}
      >
        <option value="">Select a location</option>
        {props.locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </FormSelect>

      <FormInput
        id="energy"
        label="Energy (kWh)"
        type="number"
        required
        step="0.01"
        min="0.01"
        value={props.formData.energyKwh}
        onChange={(e) => props.onChange('energyKwh', e.target.value)}
        placeholder="0.00"
        disabled={props.isLoading}
      />

      <FormInput
        id="rate"
        label="Rate ($/kWh)"
        type="number"
        required
        step="0.001"
        min="0.001"
        value={props.formData.ratePerKwh}
        onChange={(e) => props.onChange('ratePerKwh', e.target.value)}
        placeholder="0.000"
        disabled={props.isLoading}
      />

      <FormInput
        id="charged-at"
        label="Charged At"
        type="datetime-local"
        required
        value={props.formData.chargedAt}
        onChange={(e) => props.onChange('chargedAt', e.target.value)}
        disabled={props.isLoading}
      />

      <FormTextarea
        id="notes"
        label="Notes (optional)"
        rows={3}
        value={props.formData.notes}
        onChange={(e) => props.onChange('notes', e.target.value)}
        placeholder="Add any notes about this charging session..."
        disabled={props.isLoading}
      />

      <div className="p-4 bg-background border border-default rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-body-secondary">Estimated Cost:</span>
          <span className="text-lg font-semibold text-primary">{formatCost(props.calculatedCost)}</span>
        </div>
      </div>

      {props.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-500">{props.error}</p>
        </div>
      )}
    </form>
  );
}
