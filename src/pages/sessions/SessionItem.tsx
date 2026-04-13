import type { ChargingSessionRecord } from '../../data/data-types';
import type { DateTimeFormatPrefs, IconName } from '../../types/shared-types';
import { Icon } from '../../components/Icon';
import { formatTime, formatDateTime } from '../../utilities/dateUtils';
import { formatCost, formatEnergy } from '../../utilities/formatUtils';
import { SessionItemActions } from './SessionItemActions';

type SessionItemProps = {
  session: ChargingSessionRecord;
  vehicleName: string;
  locationName: string;
  locationIcon: IconName;
  locationColor: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showFullDate?: boolean;
  dateTimeFormatPrefs?: DateTimeFormatPrefs;
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
    showFullDate: showDate,
    dateTimeFormatPrefs
  } = props;

  const timestamp = showDate
    ? formatDateTime(session.chargedAt, dateTimeFormatPrefs)
    : formatTime(session.chargedAt, dateTimeFormatPrefs);

  return (
    <div className="bg-surface border-default rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-body-secondary shrink-0 text-sm">{timestamp}</span>
          <span className="text-body-tertiary shrink-0">•</span>
          <span className="text-body truncate font-medium">{vehicleName}</span>
        </div>

        {onEdit && onDelete && <SessionItemActions sessionId={session.id} onEdit={onEdit} onDelete={onDelete} />}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Icon name={locationIcon} size="sm" color={locationColor} className="shrink-0" />
          <span className="text-body-secondary truncate">{locationName}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-body">{formatEnergy(session.energyKwh)}</span>
          <span className="text-body-tertiary">•</span>
          <span className="text-body font-semibold">{formatCost(session.costCents)}</span>
        </div>
      </div>

      {session.notes && <p className="text-body-secondary mt-2 text-sm italic">{session.notes}</p>}
    </div>
  );
}
