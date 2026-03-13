import type { SessionWithMetadata } from '../../helpers/sessionHelpers';
import { SessionItem } from '../sessions/SessionItem';

type DashboardRecentSessionsProps = {
  sessions: SessionWithMetadata[];
};

export function DashboardRecentSessions({ sessions }: DashboardRecentSessionsProps) {
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
        />
      ))}
    </div>
  );
}
