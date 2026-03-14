import { clsx } from 'clsx';
import type { Vehicle, Location } from '../data/data-types';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { FormSelect } from '../components/FormSelect';
import { getVehicleDisplayName } from '../helpers/sessionHelpers';
import { TIME_FILTER_OPTIONS } from '../constants';
import type { TimeFilterValue } from '../types/shared-types';

type SessionsFilterProps = {
  vehicles: Vehicle[];
  locations: Location[];
  selectedVehicleId: string | undefined;
  selectedLocationId: string | undefined;
  selectedTimeRange: TimeFilterValue;
  onVehicleChange: (id: string | undefined) => void;
  onLocationChange: (id: string | undefined) => void;
  onTimeRangeChange: (value: TimeFilterValue) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
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
    onClearFilters,
    isOpen,
    onToggle,
    className
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
    onTimeRangeChange(event.target.value as TimeFilterValue);
  };

  return (
    <div className={clsx('p-4 bg-surface border border-default rounded-lg', className ?? 'mb-6')}>
      <button
        type="button"
        className="flex items-center gap-2 w-full text-left"
        onClick={onToggle}
      >
        <Icon name="filter" size="sm" className="text-body-secondary" />
        <h2 className="text-sm font-semibold text-body flex-1">Filters</h2>
        <Icon
          name="chevron-down"
          size="sm"
          className={`text-body-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FormSelect
                id="time-range-filter"
                label="Time Range"
                labelClassName="text-body-secondary"
                value={selectedTimeRange}
                onChange={handleTimeRangeChange}
                className="bg-background"
                options={TIME_FILTER_OPTIONS.map(({ label, value }) => ({ value, text: label }))}
              />

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
                    text: getVehicleDisplayName(vehicle)
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
        </div>
      </div>
    </div>
  );
}
