import { Link } from 'react-router-dom';
import type { SessionWithMetadata } from '../../helpers/sessionHelpers';
import { SectionHeader } from '../../components/SectionHeader';
import { SessionItem } from '../sessions/SessionItem';

type DashboardRecentSessionsProps = {
  sessions: SessionWithMetadata[];
};

export function DashboardRecentSessions({ sessions }: DashboardRecentSessionsProps) {
  return (
    <div>
      <SectionHeader
        title="Recent Sessions"
        action={
          <Link to="/sessions" className="text-sm text-primary font-medium">
            View all
          </Link>
        }
      />
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
    </div>
  );
}
