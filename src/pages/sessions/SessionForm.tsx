import { Icon } from '../../components/Icon';
import { formatCost } from '../../utilities/formatUtils';
import type { Vehicle, Location } from '../../data/data-types';
import { getVehicleDisplayName } from './sessionHelpers';

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
      <div>
        <label htmlFor="vehicle" className="block text-sm font-medium text-body mb-1">
          Vehicle <span className="text-red-500">*</span>
        </label>
        <select
          id="vehicle"
          required
          value={props.formData.vehicleId}
          onChange={(e) => props.onChange('vehicleId', e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-default rounded-lg
            text-body appearance-none focus:outline-none focus:ring-2
            focus:ring-primary focus:border-transparent"
          disabled={props.isLoading}
        >
          <option value="">Select a vehicle</option>
          {props.vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {getVehicleDisplayName(vehicle)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-body mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="location"
            required
            value={props.formData.locationId}
            onChange={(e) => props.onChange('locationId', e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
              text-body appearance-none focus:outline-none focus:ring-2
              focus:ring-primary focus:border-transparent"
            disabled={props.isLoading}
          >
            <option value="">Select a location</option>
            {props.locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <Icon
            name="chevron-down"
            size="sm"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-body-secondary pointer-events-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="energy" className="block text-sm font-medium text-body mb-1">
          Energy (kWh) <span className="text-red-500">*</span>
        </label>
        <input
          id="energy"
          type="number"
          required
          step="0.01"
          min="0.01"
          value={props.formData.energyKwh}
          onChange={(e) => props.onChange('energyKwh', e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-default rounded-lg
            text-body placeholder-body-tertiary focus:outline-none
            focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="0.00"
          disabled={props.isLoading}
        />
      </div>

      <div>
        <label htmlFor="rate" className="block text-sm font-medium text-body mb-1">
          Rate ($/kWh) <span className="text-red-500">*</span>
        </label>
        <input
          id="rate"
          type="number"
          required
          step="0.001"
          min="0.001"
          value={props.formData.ratePerKwh}
          onChange={(e) => props.onChange('ratePerKwh', e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-default rounded-lg
            text-body placeholder-body-tertiary focus:outline-none
            focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="0.000"
          disabled={props.isLoading}
        />
      </div>

      <div>
        <label htmlFor="charged-at" className="block text-sm font-medium text-body mb-1">
          Charged At <span className="text-red-500">*</span>
        </label>
        <input
          id="charged-at"
          type="datetime-local"
          required
          value={props.formData.chargedAt}
          onChange={(e) => props.onChange('chargedAt', e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-default rounded-lg
            text-body placeholder-body-tertiary focus:outline-none
            focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={props.isLoading}
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-body mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          value={props.formData.notes}
          onChange={(e) => props.onChange('notes', e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-default rounded-lg
            text-body placeholder-body-tertiary focus:outline-none
            focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Add any notes about this charging session..."
          disabled={props.isLoading}
        />
      </div>

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
