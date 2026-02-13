import type { ChargingSession } from '../../data/data-types';
import type { IconName } from '../../components/Icon';
import { Icon } from '../../components/Icon';
import { formatTime } from '../../utilities/dateUtils';
import { formatCost, formatEnergy } from '../../utilities/formatUtils';

type SessionItemProps = {
  session: ChargingSession;
  vehicleName: string;
  locationName: string;
  locationIcon: IconName;
  locationColor: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function SessionItem(props: SessionItemProps) {
  const { session, vehicleName, locationName, locationIcon, locationColor, onEdit, onDelete } =
    props;

  const handleEdit = () => {
    onEdit(session.id);
  };

  const handleDelete = () => {
    onDelete(session.id);
  };

  return (
    <div className="p-4 bg-surface border border-default rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-body-secondary text-sm">{formatTime(session.chargedAt)}</span>
            <span className="text-body-tertiary">•</span>
            <span className="text-body font-medium">{vehicleName}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Icon name={locationIcon} size="sm" color={locationColor} />
            <span className="text-body-secondary text-sm">{locationName}</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-body">{formatEnergy(session.energyKwh)}</span>
            <span className="text-body-tertiary">•</span>
            <span className="text-body font-semibold">{formatCost(session.costCents)}</span>
          </div>

          {session.notes && (
            <p className="mt-2 text-sm text-body-secondary italic">{session.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEdit}
            className="p-2 text-body-secondary hover:text-body hover:bg-background rounded-lg transition-colors"
            aria-label="Edit session"
          >
            <Icon name="edit" size="sm" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-body-secondary hover:text-red-500 hover:bg-background rounded-lg transition-colors"
            aria-label="Delete session"
          >
            <Icon name="trash-2" size="sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
