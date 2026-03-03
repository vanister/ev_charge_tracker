import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '../../hooks/useSessions';
import { useVehicles } from '../../hooks/useVehicles';
import type { ChargingSession, Vehicle, Location as AppLocation } from '../../data/data-types';
import { useLocations } from '../../hooks/useLocations';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useImmerState } from '../../hooks/useImmerState';
import { ItemListButton } from '../../components/ItemListButton';
import { SessionsFilter } from './SessionsFilter';
import { SessionDateGroup } from './SessionDateGroup';
import { SessionsEmptyState } from './SessionsEmptyState';
import { formatDate, getDateRangeForTimeFilter } from '../../utilities/dateUtils';
import { createVehicleMap, createLocationMap, groupSessionsByDate } from '../../helpers/sessionHelpers';

type SessionsListState = {
  selectedVehicleId: string | undefined;
  selectedLocationId: string | undefined;
  selectedTimeRange: string;
  vehicles: Vehicle[];
  isLoading: boolean;
  sessions: ChargingSession[];
  locations: AppLocation[];
};

const DEFAULT_STATE: SessionsListState = {
  selectedVehicleId: undefined,
  selectedLocationId: undefined,
  selectedTimeRange: '7d',
  vehicles: [],
  isLoading: true,
  sessions: [],
  locations: []
};

export function SessionsList() {
  usePageTitle('Sessions');

  const navigate = useNavigate();
  const [state, setState] = useImmerState<SessionsListState>(DEFAULT_STATE);
  const { getLocationList } = useLocations();
  const { getVehicleList } = useVehicles();
  const { getSessionList, deleteSession } = useSessions();
  const vehicleMap = useMemo(() => createVehicleMap(state.vehicles), [state.vehicles]);
  const locationMap = useMemo(() => createLocationMap(state.locations), [state.locations]);
  const sessionsByDate = useMemo(
    () => groupSessionsByDate(state.sessions, vehicleMap, locationMap),
    [state.sessions, vehicleMap, locationMap]
  );

  const hasActiveFilters = Boolean(state.selectedVehicleId || state.selectedLocationId);
  const hasSessions = state.sessions.length > 0;

  useEffect(() => {
    const loadLocations = async () => {
      const result = await getLocationList();

      if (result.success) {
        setState((draft) => {
          draft.locations = result.data;
        });
      }
    };

    loadLocations();
  }, [getLocationList, setState]);

  useEffect(() => {
    const loadVehicles = async () => {
      const result = await getVehicleList();

      if (result.success) {
        setState((draft) => {
          draft.vehicles = result.data;
        });
      }
    };

    loadVehicles();
  }, [getVehicleList, setState]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const dateRange = getDateRangeForTimeFilter(state.selectedTimeRange);
        const result = await getSessionList({
          vehicleId: state.selectedVehicleId,
          locationId: state.selectedLocationId,
          dateRange
        });

        if (result.success) {
          setState((draft) => {
            draft.sessions = result.data;
          });
        }
      } finally {
        setState((draft) => {
          draft.isLoading = false;
        });
      }
    };

    loadSessions();
  }, [getSessionList, state.selectedVehicleId, state.selectedLocationId, state.selectedTimeRange, setState]);

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

    setState((draft) => {
      draft.sessions = draft.sessions.filter((s) => s.id !== id);
    });
  };

  const handleAddSession = () => {
    navigate('/sessions/add');
  };

  const handleClearFilters = () => {
    setState((draft) => {
      draft.selectedVehicleId = undefined;
      draft.selectedLocationId = undefined;
    });
  };

  const handleVehicleChange = (id: string | undefined) => {
    setState((draft) => {
      draft.selectedVehicleId = id;
    });
  };

  const handleLocationChange = (id: string | undefined) => {
    setState((draft) => {
      draft.selectedLocationId = id;
    });
  };

  const handleTimeRangeChange = (value: string) => {
    setState((draft) => {
      draft.selectedTimeRange = value;
    });
  };

  if (!state.isLoading && !hasSessions) {
    return (
      <div className="flex-1 bg-background px-4 py-6 flex flex-col">
        <SessionsEmptyState
          hasFilters={hasActiveFilters}
          onAddSession={handleAddSession}
          onClearFilters={handleClearFilters}
        />
      </div>
    );
  }

  return (
    <div className="bg-background px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <SessionsFilter
          vehicles={state.vehicles}
          locations={state.locations}
          selectedVehicleId={state.selectedVehicleId}
          selectedLocationId={state.selectedLocationId}
          selectedTimeRange={state.selectedTimeRange}
          onVehicleChange={handleVehicleChange}
          onLocationChange={handleLocationChange}
          onTimeRangeChange={handleTimeRangeChange}
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
            <ItemListButton className="mb-6" label="Add session" onClick={handleAddSession} />

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
    </div>
  );
}
