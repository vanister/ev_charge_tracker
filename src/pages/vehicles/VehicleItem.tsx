import { Link } from 'react-router-dom';
import type { VehicleRecord } from '../../data/data-types';
import { Icon } from '../../components/Icon';
import { getVehicleDisplayName } from './vehicleHelpers';

type VehicleItemProps = {
  vehicle: VehicleRecord;
  onDelete: (id: string) => void;
};

export function VehicleItem(props: VehicleItemProps) {
  const { vehicle, onDelete } = props;

  const handleDelete = () => {
    onDelete(vehicle.id);
  };

  const displayName = getVehicleDisplayName(vehicle);
  const subtitle = vehicle.name ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : `${vehicle.year}`;

  return (
    <div className="bg-surface border-default hover:border-default-hover rounded-lg border p-4 transition-colors">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-body mb-1 text-lg font-semibold">{displayName}</h3>
          <p className="text-body-secondary text-sm">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/vehicles/${vehicle.id}/maintenance`}
            className="text-body-secondary hover:text-body hover:bg-background rounded-lg p-2 transition-colors"
            aria-label="View maintenance records"
          >
            <Icon name="wrench" size="sm" />
          </Link>
          <Link
            to={`/vehicles/${vehicle.id}/edit`}
            className="text-body-secondary hover:text-body hover:bg-background rounded-lg p-2 transition-colors"
            aria-label="Edit vehicle"
          >
            <Icon name="edit" size="sm" />
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="text-body-secondary hover:bg-background rounded-lg p-2 transition-colors hover:text-red-500"
            aria-label="Delete vehicle"
          >
            <Icon name="trash-2" size="sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
