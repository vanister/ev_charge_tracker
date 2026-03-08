import { Link } from 'react-router-dom';
import type { Location } from '../../data/data-types';
import { Icon } from '../../components/Icon';
import { formatRate } from '../../utilities/formatUtils';

type LocationItemProps = {
  location: Location;
};

export function LocationItem(props: LocationItemProps) {
  const { location } = props;

  return (
    <div className="p-4 bg-surface border border-default rounded-lg hover:border-default-hover transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-background rounded-lg shrink-0">
          <Icon name={location.icon} size="md" color={location.color} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-body">{location.name}</p>
          <p className="text-sm text-body-secondary">{formatRate(location.defaultRate)}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/settings/locations/${location.id}/edit`}
            className="p-2 text-body-secondary hover:text-body hover:bg-background rounded-lg transition-colors"
            aria-label="Edit location"
          >
            <Icon name="edit" size="sm" />
          </Link>
        </div>
      </div>
    </div>
  );
}
