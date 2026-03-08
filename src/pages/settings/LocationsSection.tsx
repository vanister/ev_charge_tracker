import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Location } from '../../data/data-types';
import { useLocations } from '../../hooks/useLocations';
import { ItemListButton } from '../../components/ItemListButton';
import { EmptyState } from '../../components/EmptyState';
import { LocationItem } from './LocationItem';

export function LocationsSectionBody() {
  const navigate = useNavigate();
  const { getLocationList } = useLocations();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const loadLocations = async () => {
      const result = await getLocationList();

      if (result.success) {
        setLocations(result.data);
      }
    };

    loadLocations();
  }, [getLocationList]);

  return locations.length === 0 ? (
    <EmptyState
      icon="map-pin"
      title="No locations yet"
      message="Add a location to track where you charge."
      actionLabel="Add Location"
      onAction={() => navigate('/settings/locations/add')}
    />
  ) : (
    <div>
      <ItemListButton
        label="Add location"
        onClick={() => navigate('/settings/locations/add')}
        className="mb-3"
      />
      <div className="space-y-3">
        {locations.map((location) => (
          <LocationItem key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
}
