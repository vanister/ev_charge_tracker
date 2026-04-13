import type { SessionWithMetadata } from '../../helpers/sessionHelpers';
import type { DateTimeFormatPrefs } from '../../types/shared-types';
import { SessionItem } from './SessionItem';

type SessionDateGroupProps = {
  date: string;
  sessions: SessionWithMetadata[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  dateTimeFormatPrefs?: DateTimeFormatPrefs;
};

export function SessionDateGroup(props: SessionDateGroupProps) {
  const { date, sessions, onEdit, onDelete, dateTimeFormatPrefs } = props;

  return (
    <div className="mb-6">
      <h3 className="text-body-secondary mb-3 px-1 text-sm font-semibold">{date}</h3>
      <div className="space-y-3">
        {sessions.map((item) => (
          <SessionItem
            key={item.session.id}
            session={item.session}
            vehicleName={item.vehicleName}
            locationName={item.locationName}
            locationIcon={item.locationIcon}
            locationColor={item.locationColor}
            onEdit={onEdit}
            onDelete={onDelete}
            dateTimeFormatPrefs={dateTimeFormatPrefs}
          />
        ))}
      </div>
    </div>
  );
}
