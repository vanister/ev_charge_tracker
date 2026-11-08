import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePageConfig } from '../../hooks/usePageConfig';
import { useDateTimeFormat } from '../../hooks/useDateTimeFormat';
import { useMaintenanceRecords } from '../../hooks/useMaintenanceRecords';
import { useVehicles } from '../../hooks/useVehicles';
import { useImmerState } from '../../hooks/useImmerState';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { ItemListButton } from '../../components/ItemListButton';
import {
  filterRecordsByVehicle,
  getActiveVehicles,
  groupRecordsByDate,
  resolveVehicleFilter,
  withVehicleQuery
} from './maintenanceHelpers';
import { createVehicleMap, getVehicleDisplayName } from '../../helpers/sessionHelpers';
import { MaintenanceItem } from './MaintenanceItem';
import { MaintenanceEmptyState } from './MaintenanceEmptyState';
import { MaintenanceVehicleFilter } from './MaintenanceVehicleFilter';
import type { MaintenanceRecord, VehicleRecord } from '../../data/data-types';

type MaintenanceListState = {
  records: MaintenanceRecord[];
  vehicles: VehicleRecord[];
  isLoading: boolean;
};

const DEFAULT_STATE: MaintenanceListState = {
  records: [],
  vehicles: [],
  isLoading: true
};

export function MaintenanceList() {
  usePageConfig('Service');

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { preferences, updatePreferences } = useUserPreferences();
  const { getMaintenanceRecordList, deleteMaintenanceRecord } = useMaintenanceRecords();
  const { prefs: dateTimePrefs } = useDateTimeFormat();
  const { getVehicleList } = useVehicles();
  const [state, setState] = useImmerState<MaintenanceListState>(DEFAULT_STATE);

  const activeVehicles = useMemo(() => getActiveVehicles(state.vehicles), [state.vehicles]);
  const vehicleMap = useMemo(() => createVehicleMap(state.vehicles), [state.vehicles]);
  // The query param wins so deep links from a vehicle open on that vehicle; a stale one falls back to the saved filter
  const selectedVehicleId =
    resolveVehicleFilter(activeVehicles, searchParams.get('vehicleId')) ??
    resolveVehicleFilter(activeVehicles, preferences.maintenanceFilterVehicleId);
  const showVehicleFilter = activeVehicles.length > 1;
  const showVehicleNames = showVehicleFilter && !selectedVehicleId;

  const visibleRecords = useMemo(
    () => filterRecordsByVehicle(state.records, selectedVehicleId),
    [state.records, selectedVehicleId]
  );
  const groups = useMemo(() => groupRecordsByDate(visibleRecords), [visibleRecords]);

  useEffect(() => {
    const load = async () => {
      // Include inactive vehicles so records of soft-deleted vehicles still show a name
      const [vehiclesResult, recordsResult] = await Promise.all([
        getVehicleList(false),
        getMaintenanceRecordList()
      ]);

      setState((draft) => {
        if (vehiclesResult.success) {
          draft.vehicles = vehiclesResult.data;
        }

        if (recordsResult.success) {
          draft.records = recordsResult.data;
        }

        draft.isLoading = false;
      });
    };

    load();
  }, [getVehicleList, getMaintenanceRecordList, setState]);

  const handleVehicleChange = (vehicleId: string | undefined) => {
    updatePreferences({ maintenanceFilterVehicleId: vehicleId });
    setSearchParams(vehicleId ? { vehicleId } : {}, { replace: true });
  };

  const handleAdd = () => {
    navigate(withVehicleQuery('/maintenance/add', selectedVehicleId));
  };

  const handleEdit = (id: string) => {
    navigate(withVehicleQuery(`/maintenance/${id}/edit`, selectedVehicleId));
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this maintenance record?');

    if (!confirmed) {
      return;
    }

    const result = await deleteMaintenanceRecord(id);

    if (!result.success) {
      alert(`Failed to delete record: ${result.error}`);
      return;
    }

    setState((draft) => {
      draft.records = draft.records.filter((r) => r.id !== id);
    });
  };

  const getRecordVehicleName = (record: MaintenanceRecord) => {
    const vehicle = vehicleMap.get(record.vehicleId);
    return showVehicleNames && vehicle ? getVehicleDisplayName(vehicle) : undefined;
  };

  if (!state.isLoading && state.records.length === 0) {
    return (
      <div className="maintenance-list bg-background flex flex-1 flex-col py-6">
        <MaintenanceEmptyState onAdd={handleAdd} />
      </div>
    );
  }

  return (
    <div className="maintenance-list bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl">
        {showVehicleFilter && (
          <MaintenanceVehicleFilter
            className="mb-4"
            vehicles={activeVehicles}
            selectedVehicleId={selectedVehicleId}
            onChange={handleVehicleChange}
          />
        )}
        <ItemListButton className="mb-6" label="Add Record" onClick={handleAdd} />
        {!state.isLoading && visibleRecords.length === 0 && (
          <p className="text-body-secondary text-center text-sm">
            No maintenance records for this vehicle.
          </p>
        )}
        {groups.map((group) => (
          <div key={group.label} className="mb-6">
            <h3 className="text-body-secondary mb-3 px-1 text-sm font-semibold">{group.label}</h3>
            <div className="space-y-3">
              {group.records.map((record) => (
                <MaintenanceItem
                  key={record.id}
                  record={record}
                  vehicleName={getRecordVehicleName(record)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  dateTimeFormatPrefs={dateTimePrefs}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
