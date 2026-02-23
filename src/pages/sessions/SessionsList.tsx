import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessions } from '../../hooks/useSessions';
import { useVehicles } from '../../hooks/useVehicles';
import type { ChargingSession, Vehicle, Location as AppLocation } from '../../data/data-types';
import { useLocations } from '../../hooks/useLocations';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/Button';
import { SectionHeader } from '../../components/SectionHeader';
import { SessionsFilter } from './SessionsFilter';
import { SessionDateGroup } from './SessionDateGroup';
import { SessionsEmptyState } from './SessionsEmptyState';
import { formatDate } from '../../utilities/dateUtils';
import { createVehicleMap, createLocationMap, groupSessionsByDate } from './sessionHelpers';

export function SessionsList() {
  usePageTitle('Sessions');

  const navigate = useNavigate();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>();
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const { getLocationList } = useLocations();
  const [locations, setLocations] = useState<AppLocation[]>([]);
  const { getVehicleList } = useVehicles();
  const { getSessionList, deleteSession } = useSessions();
  const vehicleMap = useMemo(() => createVehicleMap(vehicles), [vehicles]);
  const locationMap = useMemo(() => createLocationMap(locations), [locations]);
  const sessionsByDate = useMemo(
    () => groupSessionsByDate(sessions, vehicleMap, locationMap),
    [sessions, vehicleMap, locationMap]
  );

  const hasActiveFilters = Boolean(selectedVehicleId || selectedLocationId);
  const hasSessions = sessions.length > 0;

  useEffect(() => {
    getLocationList().then(setLocations);
  }, [getLocationList]);

  useEffect(() => {
    getVehicleList().then(setVehicles);
  }, [getVehicleList]);

  useEffect(() => {
    getSessionList({ vehicleId: selectedVehicleId, locationId: selectedLocationId })
      .then(setSessions)
      .finally(() => setIsLoading(false));
  }, [getSessionList, selectedVehicleId, selectedLocationId]);

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
      return;
    }

    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddSession = () => {
    navigate('/sessions/add');
  };

  const handleClearFilters = () => {
    setSelectedVehicleId(undefined);
    setSelectedLocationId(undefined);
  };

  if (!isLoading && !hasSessions) {
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
      <SectionHeader
        action={
          <Link to="/sessions/add">
            <Button variant="primary">Add</Button>
          </Link>
        }
      />

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
