import { clsx } from 'clsx';
import { FormSelect } from '../../components/FormSelect';
import { getVehicleDisplayName } from '../../helpers/sessionHelpers';
import type { VehicleRecord } from '../../data/data-types';

type MaintenanceVehicleFilterProps = {
  vehicles: VehicleRecord[];
  selectedVehicleId: string | undefined;
  onChange: (vehicleId: string | undefined) => void;
  className?: string;
};

export function MaintenanceVehicleFilter(props: MaintenanceVehicleFilterProps) {
  const { vehicles, selectedVehicleId, onChange, className } = props;

  return (
    <div className={clsx('maintenance-vehicle-filter', className)}>
      <FormSelect
        id="maintenance-vehicle-filter"
        label="Vehicle"
        value={selectedVehicleId ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        options={[
          { value: '', text: 'All vehicles' },
          ...vehicles.map((v) => ({ value: v.id, text: getVehicleDisplayName(v) }))
        ]}
      />
    </div>
  );
}
