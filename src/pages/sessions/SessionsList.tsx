import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSessions } from '../../hooks/useSessions';
import { useVehicles } from '../../hooks/useVehicles';
import { useLocations } from '../../hooks/useLocations';
import { SessionsFilter } from './SessionsFilter';
import { SessionDateGroup } from './SessionDateGroup';
import { SessionsEmptyState } from './SessionsEmptyState';
import { formatDate } from '../../utilities/dateUtils';
import { createVehicleMap, createLocationMap, groupSessionsByDate } from './sessionHelpers';

export function SessionsList() {
  const navigate = useNavigate();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>();
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>();

  const { vehicles } = useVehicles();
  const { locations } = useLocations();
  const { getSessionList, deleteSession } = useSessions();

  const sessions = useLiveQuery(
    () =>
      getSessionList({
        vehicleId: selectedVehicleId,
        locationId: selectedLocationId
      }),
    [getSessionList, selectedVehicleId, selectedLocationId]
  );

  const vehicleMap = useMemo(() => createVehicleMap(vehicles), [vehicles]);
  const locationMap = useMemo(() => createLocationMap(locations), [locations]);
  const sessionsByDate = useMemo(
    () => groupSessionsByDate(sessions ?? [], vehicleMap, locationMap),
    [sessions, vehicleMap, locationMap]
  );

  const hasActiveFilters = Boolean(selectedVehicleId || selectedLocationId);
  const hasSessions = (sessions ?? []).length > 0;

  const handleEdit = (id: string) => {
    navigate(`/sessions/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this charging session?');

    if (!confirmed) {
      return;
    }

    const result = await deleteSession(id);

    if (!result.success) {
      alert(`Failed to delete session: ${result.error}`);
    }
  };

  const handleAddSession = () => {
    navigate('/sessions/add');
  };

  const handleClearFilters = () => {
    setSelectedVehicleId(undefined);
    setSelectedLocationId(undefined);
  };

  if (!hasSessions) {
    return (
      <div className="h-[calc(100vh-5rem)] bg-background px-4 py-6 flex flex-col">
        <SessionsEmptyState
          hasFilters={hasActiveFilters}
          onAddSession={handleAddSession}
          onClearFilters={handleClearFilters}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <SessionsFilter
        vehicles={vehicles}
        locations={locations}
        selectedVehicleId={selectedVehicleId}
        selectedLocationId={selectedLocationId}
        onVehicleChange={setSelectedVehicleId}
        onLocationChange={setSelectedLocationId}
        onClearFilters={handleClearFilters}
      />

      {sessionsByDate.length === 0 ? (
        <SessionsEmptyState
          hasFilters={hasActiveFilters}
          onAddSession={handleAddSession}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div>
          {sessionsByDate.map(([dateKey, sessionsInGroup]) => (
            <SessionDateGroup
              key={dateKey}
              date={formatDate(sessionsInGroup[0].session.chargedAt, 'EEEE, MMM dd, yyyy')}
              sessions={sessionsInGroup}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
