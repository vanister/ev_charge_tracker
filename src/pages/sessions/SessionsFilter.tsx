import type { Vehicle, Location } from '../../data/data-types';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { FormSelect } from '../../components/FormSelect';
import { getVehicleDisplayName } from '../../helpers/sessionHelpers';
import { TIME_FILTER_OPTIONS } from '../../utilities/dateUtils';

type SessionsFilterProps = {
  vehicles: Vehicle[];
  locations: Location[];
  selectedVehicleId: string | undefined;
  selectedLocationId: string | undefined;
  selectedTimeRange: string;
  onVehicleChange: (id: string | undefined) => void;
  onLocationChange: (id: string | undefined) => void;
  onTimeRangeChange: (value: string) => void;
  onClearFilters: () => void;
};

export function SessionsFilter(props: SessionsFilterProps) {
  const {
    vehicles,
    locations,
    selectedVehicleId,
    selectedLocationId,
    selectedTimeRange,
    onVehicleChange,
    onLocationChange,
    onTimeRangeChange,
    onClearFilters
  } = props;

  const hasActiveFilters = !!(selectedVehicleId || selectedLocationId);

  const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onVehicleChange(value === '' ? undefined : value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onLocationChange(value === '' ? undefined : value);
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onTimeRangeChange(event.target.value);
  };

  return (
    <div className="mb-6 p-4 bg-surface border border-default rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="filter" size="sm" className="text-body-secondary" />
        <h2 className="text-sm font-semibold text-body">Filters</h2>
      </div>

      <div className="mb-4">
        <FormSelect
          id="time-range-filter"
          label="Time Range"
          labelClassName="text-body-secondary"
          value={selectedTimeRange}
          onChange={handleTimeRangeChange}
          className="bg-background"
          options={TIME_FILTER_OPTIONS.map(({ label, value }) => ({ value, text: label }))}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FormSelect
          id="vehicle-filter"
          label="Vehicle"
          labelClassName="text-body-secondary"
          value={selectedVehicleId || ''}
          onChange={handleVehicleChange}
          className="bg-background"
          options={[
            { value: '', text: 'All Vehicles' },
            ...vehicles.map((vehicle) => ({
              value: vehicle.id,
              text: `${vehicle.icon} ${getVehicleDisplayName(vehicle)}`
            }))
          ]}
        />

        <FormSelect
          id="location-filter"
          label="Location"
          labelClassName="text-body-secondary"
          value={selectedLocationId || ''}
          onChange={handleLocationChange}
          className="bg-background"
          options={[
            { value: '', text: 'All Locations' },
            ...locations.map((location) => ({ value: location.id, text: location.name }))
          ]}
        />
      </div>

      {hasActiveFilters && (
        <Button variant="secondary" onClick={onClearFilters} fullWidth>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
