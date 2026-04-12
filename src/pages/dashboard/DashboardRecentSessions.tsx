import type { SessionWithMetadata } from '../../helpers/sessionHelpers';
import type { DateTimeFormatPrefs } from '../../types/shared-types';
import { SessionItem } from '../sessions/SessionItem';

type DashboardRecentSessionsProps = {
  sessions: SessionWithMetadata[];
  dateTimeFormatPrefs?: DateTimeFormatPrefs;
};

export function DashboardRecentSessions({ sessions, dateTimeFormatPrefs }: DashboardRecentSessionsProps) {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {sessions.map(({ session, vehicleName, locationName, locationIcon, locationColor }) => (
        <SessionItem
          key={session.id}
          session={session}
          vehicleName={vehicleName}
          locationName={locationName}
          locationIcon={locationIcon}
          locationColor={locationColor}
          showFullDate
          dateTimeFormatPrefs={dateTimeFormatPrefs}
        />
      ))}
    </div>
  );
}
