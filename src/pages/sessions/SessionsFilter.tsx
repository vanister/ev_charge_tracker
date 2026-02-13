import type { Vehicle, Location } from '../../data/data-types';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

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
        <div>
          <label htmlFor="vehicle-filter" className="block text-sm text-body-secondary mb-2">
            Vehicle
          </label>
          <div className="relative">
            <select
              id="vehicle-filter"
              value={selectedVehicleId || ''}
              onChange={handleVehicleChange}
              className="w-full px-3 py-2 bg-background border border-default rounded-lg text-body appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Vehicles</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.icon} {getVehicleDisplayName(vehicle)}
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
          <label htmlFor="location-filter" className="block text-sm text-body-secondary mb-2">
            Location
          </label>
          <div className="relative">
            <select
              id="location-filter"
              value={selectedLocationId || ''}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 bg-background border border-default rounded-lg text-body appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
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
      </div>

      {hasActiveFilters && (
        <Button variant="secondary" onClick={onClearFilters} fullWidth>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
