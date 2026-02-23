import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Location } from '../../data/data-types';
import { useLocations } from '../../hooks/useLocations';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useImmerState } from '../../hooks/useImmerState';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';
import { LocationItem } from './LocationItem';
import { formatBytes } from '../../utilities/formatUtils';

type SettingsState = {
  storageUsed: number | null;
  storageQuota: number | null;
};

const DEFAULT_STATE: SettingsState = {
  storageUsed: null,
  storageQuota: null
};

export function Settings() {
  usePageTitle('Settings');

  const navigate = useNavigate();
  const { getLocationList, deleteLocation } = useLocations();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    getLocationList().then(setLocations);
  }, [getLocationList]);
  const [state, setState] = useImmerState<SettingsState>(DEFAULT_STATE);

  useEffect(() => {
    navigator.storage?.estimate?.().then((estimate) => {
      setState((draft) => {
        draft.storageUsed = estimate?.usage ?? null;
        draft.storageQuota = estimate?.quota ?? null;
      });
    });
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this location?');

    if (!confirmed) {
      return;
    }

    const result = await deleteLocation(id);

    if (!result.success) {
      alert(`Failed to delete location: ${result.error}`);
      return;
    }

    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const storagePercent =
    state.storageUsed !== null && state.storageQuota !== null && state.storageQuota > 0
      ? Math.min(100, (state.storageUsed / state.storageQuota) * 100)
      : null;

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <section>
          <SectionHeader
            title="Locations"
            action={
              <Link to="/settings/locations/add">
                <Button variant="primary">Add</Button>
              </Link>
            }
          />

          {locations.length === 0 ? (
            <EmptyState
              icon="map-pin"
              title="No locations yet"
              message="Add a location to track where you charge."
              actionLabel="Add Location"
              onAction={() => navigate('/settings/locations/add')}
            />
          ) : (
            <div className="space-y-3">
              {locations.map((location) => (
                <LocationItem key={location.id} location={location} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Storage" />
          <div className="p-4 bg-surface border border-default rounded-lg space-y-3">
            {state.storageUsed !== null && state.storageQuota !== null ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-body-secondary">Used</span>
                  <span className="text-body font-medium">
                    {formatBytes(state.storageUsed)} of {formatBytes(state.storageQuota)}
                  </span>
                </div>
                {storagePercent !== null && (
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${storagePercent}%` }}
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-body-secondary">Storage information unavailable</p>
            )}
          </div>
        </section>

        <section>
          <SectionHeader title="About" />
          <div className="p-4 bg-surface border border-default rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="zap" size="md" className="text-primary" />
              </div>
              <div>
                <p className="text-base font-semibold text-body">EV Charge Tracker</p>
                <p className="text-sm text-body-secondary">Version 1.0.0</p>
              </div>
            </div>
            <p className="text-sm text-body-secondary">
              Track your electric vehicle charging sessions, costs, and usage across all your locations.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
