import { useEffect, useState } from 'react';
import type { Location } from '../../data/data-types';
import { useLocations } from '../../hooks/useLocations';
import { EmptyState } from '../../components/EmptyState';
import { LocationItem } from './LocationItem';

export function LocationsSectionBody() {
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
    <EmptyState icon="map-pin" title="No locations yet" message="No locations have been added." />
  ) : (
    <div className="space-y-3">
      {locations.map((location) => (
        <LocationItem key={location.id} location={location} />
      ))}
    </div>
  );
}
