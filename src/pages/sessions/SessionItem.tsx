import type { ChargingSession } from '../../data/data-types';
import type { IconName } from '../../components/Icon';
import { Icon } from '../../components/Icon';
import { formatTime, formatDateTime } from '../../utilities/dateUtils';
import { formatCost, formatEnergy } from '../../utilities/formatUtils';
import { SessionItemActions } from './SessionItemActions';

type SessionItemProps = {
  session: ChargingSession;
  vehicleName: string;
  locationName: string;
  locationIcon: IconName;
  locationColor: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showFullDate?: boolean;
};

export function SessionItem(props: SessionItemProps) {
  const {
    session,
    vehicleName,
    locationName,
    locationIcon,
    locationColor,
    onEdit,
    onDelete,
    showFullDate: showDate
  } = props;

  const timestamp = showDate ? formatDateTime(session.chargedAt) : formatTime(session.chargedAt);

  return (
    <div className="p-4 bg-surface border border-default rounded-lg">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-body-secondary text-sm shrink-0">{timestamp}</span>
          <span className="text-body-tertiary shrink-0">•</span>
          <span className="text-body font-medium truncate">{vehicleName}</span>
        </div>

        {onEdit && onDelete && <SessionItemActions sessionId={session.id} onEdit={onEdit} onDelete={onDelete} />}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Icon name={locationIcon} size="sm" color={locationColor} className="shrink-0" />
          <span className="text-body-secondary truncate">{locationName}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-body">{formatEnergy(session.energyKwh)}</span>
          <span className="text-body-tertiary">•</span>
          <span className="text-body font-semibold">{formatCost(session.costCents)}</span>
        </div>
      </div>

      {session.notes && <p className="mt-2 text-sm text-body-secondary italic">{session.notes}</p>}
    </div>
  );
}
