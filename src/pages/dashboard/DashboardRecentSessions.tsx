import { Link } from 'react-router-dom';
import type { SessionWithMetadata } from '../../helpers/sessionHelpers';
import { Icon } from '../../components/Icon';
import { SectionHeader } from '../../components/SectionHeader';
import { formatDate, formatTime } from '../../utilities/dateUtils';
import { formatCost, formatEnergy } from '../../utilities/formatUtils';

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
          <div key={session.id} className="p-4 bg-surface border border-default rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-body-secondary">{formatDate(session.chargedAt)}</span>
              <span className="text-body-tertiary">•</span>
              <span className="text-sm text-body font-medium truncate">{vehicleName}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Icon name={locationIcon} size="sm" color={locationColor} />
              <span className="text-sm text-body-secondary">{locationName}</span>
              <span className="text-body-tertiary">•</span>
              <span className="text-sm text-body-secondary">{formatTime(session.chargedAt)}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-body">{formatEnergy(session.energyKwh)}</span>
              <span className="text-body-tertiary">•</span>
              <span className="text-body font-semibold">{formatCost(session.costCents)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
