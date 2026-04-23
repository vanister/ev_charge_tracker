import { clsx } from 'clsx';
import type { VehicleRecord, LocationRecord } from '../data/data-types';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { FormSelect } from '../components/FormSelect';
import { getVehicleDisplayName } from '../helpers/sessionHelpers';
import { TIME_FILTER_OPTIONS } from '../constants';
import type { TimeFilterValue } from '../types/shared-types';

type FilterPanelProps = {
  vehicles: VehicleRecord[];
  locations: LocationRecord[];
  selectedVehicleId: string | undefined;
  selectedLocationId: string | undefined;
  selectedTimeRange: TimeFilterValue;
  onVehicleChange: (id: string | undefined) => void;
  onLocationChange: (id: string | undefined) => void;
  onTimeRangeChange: (value: TimeFilterValue) => void;
  onClearFilters: () => void;
  isOpen?: boolean;
  onToggle: () => void;
  className?: string;
};

export function FilterPanel(props: FilterPanelProps) {
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
    isOpen = false,
    onToggle,
    className
  } = props;

  const hasActiveFilters = !!(selectedVehicleId || selectedLocationId);
  const timeRangeLabel = TIME_FILTER_OPTIONS.find((o) => o.value === selectedTimeRange)?.label ?? '';

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
    <div className={clsx('bg-surface border-default rounded-lg border p-4', className ?? 'mb-6')}>
      <button type="button" className="flex w-full items-center gap-2 text-left" onClick={onToggle}>
        <Icon name="filter" size="sm" className="text-body-secondary" />
        <h2 className="text-body flex-1 text-sm font-semibold">
          Filters {timeRangeLabel && `(${timeRangeLabel})`}
        </h2>
        <Icon
          name="chevron-down"
          size="sm"
          className={clsx('text-body-secondary transition-transform duration-200', { 'rotate-180': isOpen })}
        />
      </button>

      <div
        className={clsx('grid transition-[grid-template-rows] duration-200', {
          'grid-rows-[1fr]': isOpen,
          'grid-rows-[0fr]': !isOpen
        })}
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
