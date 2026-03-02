import type { Vehicle, Location } from '../../data/data-types';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { FormSelect } from '../../components/FormSelect';

type SessionsFilterProps = {
  vehicles: Vehicle[];
  locations: Location[];
  selectedVehicleId: string | undefined;
  selectedLocationId: string | undefined;
  onVehicleChange: (id: string | undefined) => void;
  onLocationChange: (id: string | undefined) => void;
  onClearFilters: () => void;
};

export function SessionsFilter(props: SessionsFilterProps) {
  const {
    vehicles,
    locations,
    selectedVehicleId,
    selectedLocationId,
    onVehicleChange,
    onLocationChange,
    onClearFilters
  } = props;

  const hasActiveFilters = selectedVehicleId || selectedLocationId;

  const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onVehicleChange(value === '' ? undefined : value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onLocationChange(value === '' ? undefined : value);
  };

  const getVehicleDisplayName = (vehicle: Vehicle) => {
    return vehicle.name || `${vehicle.make} ${vehicle.model}`;
  };

  return (
    <div className="mb-6 p-4 bg-surface border border-default rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="filter" size="sm" className="text-body-secondary" />
        <h2 className="text-sm font-semibold text-body">Filters</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FormSelect
          id="vehicle-filter"
          label="Vehicle"
          labelClassName="text-body-secondary"
          value={selectedVehicleId || ''}
          onChange={handleVehicleChange}
          className="bg-background"
        >
          <option value="">All Vehicles</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.icon} {getVehicleDisplayName(vehicle)}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          id="location-filter"
          label="Location"
          labelClassName="text-body-secondary"
          value={selectedLocationId || ''}
          onChange={handleLocationChange}
          className="bg-background"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </FormSelect>
      </div>

      {hasActiveFilters && (
        <Button variant="secondary" onClick={onClearFilters} fullWidth>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
