import { Link } from 'react-router-dom';
import type { LocationRecord } from '../../data/data-types';
import { Icon } from '../../components/Icon';
import { formatRate } from '../../utilities/formatUtils';

type LocationItemProps = {
  location: LocationRecord;
};

export function LocationItem(props: LocationItemProps) {
  const { location } = props;

  return (
    <div className="bg-surface border-default hover:border-default-hover rounded-lg border p-4 transition-colors">
      <div className="flex items-center gap-4">
        <div className="bg-background shrink-0 rounded-lg p-2">
          <Icon name={location.icon} size="md" color={location.color} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-body text-base font-semibold">{location.name}</p>
          <p className="text-body-secondary text-sm">{formatRate(location.defaultRate)}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/settings/locations/${location.id}/edit`}
            className="text-body-secondary hover:text-body hover:bg-background rounded-lg p-2 transition-colors"
            aria-label="Edit location"
          >
            <Icon name="edit" size="sm" />
          </Link>
        </div>
      </div>
    </div>
  );
}
