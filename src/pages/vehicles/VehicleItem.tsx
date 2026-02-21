import { Link } from 'react-router-dom';
import type { Vehicle } from '../../data/data-types';
import { Icon } from '../../components/Icon';
import { getVehicleDisplayName } from './vehicleHelpers';

type VehicleItemProps = {
  vehicle: Vehicle;
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
    <div className="p-4 bg-surface border border-default rounded-lg hover:border-default-hover transition-colors">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{vehicle.icon}</div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-body mb-1">{displayName}</h3>
          <p className="text-sm text-body-secondary">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/vehicles/${vehicle.id}/edit`}
            className="p-2 text-body-secondary hover:text-body hover:bg-background rounded-lg transition-colors"
            aria-label="Edit vehicle"
          >
            <Icon name="edit" size="sm" />
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-body-secondary hover:text-red-500 hover:bg-background rounded-lg transition-colors"
            aria-label="Delete vehicle"
          >
            <Icon name="trash-2" size="sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
