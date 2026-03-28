import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageConfig } from '../../../hooks/usePageConfig';
import { useMaintenanceRecords } from '../../../hooks/useMaintenanceRecords';
import { useVehicles } from '../../../hooks/useVehicles';
import { useImmerState } from '../../../hooks/useImmerState';
import { ItemListButton } from '../../../components/ItemListButton';
import { groupRecordsByDate } from './maintenanceHelpers';
import { getVehicleDisplayName } from '../vehicleHelpers';
import { MaintenanceItem } from './MaintenanceItem';
import { MaintenanceEmptyState } from './MaintenanceEmptyState';
import type { MaintenanceRecord, Vehicle } from '../../../data/data-types';

type MaintenanceListState = {
  records: MaintenanceRecord[];
  vehicle: Vehicle | undefined;
  isLoading: boolean;
};

const DEFAULT_STATE: MaintenanceListState = {
  records: [],
  vehicle: undefined,
  isLoading: true
};

export function MaintenanceList() {
  usePageConfig('Maintenance', false);

  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { getMaintenanceRecordList, deleteMaintenanceRecord } = useMaintenanceRecords();
  const { getVehicle } = useVehicles();
  const [state, setState] = useImmerState<MaintenanceListState>(DEFAULT_STATE);

  const groups = useMemo(() => groupRecordsByDate(state.records), [state.records]);

  useEffect(() => {
    if (!vehicleId) {
      return;
    }

    const load = async () => {
      const [vehicleResult, recordsResult] = await Promise.all([
        getVehicle(vehicleId),
        getMaintenanceRecordList(vehicleId)
      ]);

      setState((draft) => {
        if (vehicleResult.success) {
          draft.vehicle = vehicleResult.data;
        }

        if (recordsResult.success) {
          draft.records = recordsResult.data;
        }

        draft.isLoading = false;
      });
    };

    load();
  }, [vehicleId, getVehicle, getMaintenanceRecordList, setState]);

  const handleAdd = () => {
    navigate(`/vehicles/${vehicleId}/maintenance/add`);
  };

  const handleEdit = (id: string) => {
    navigate(`/vehicles/${vehicleId}/maintenance/${id}/edit`);
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

  const vehicleHeading = state.vehicle
    ? state.vehicle.isActive === 0
      ? `${getVehicleDisplayName(state.vehicle)} (removed)`
      : getVehicleDisplayName(state.vehicle)
    : undefined;

  if (!state.isLoading && state.records.length === 0) {
    return (
      <div className="bg-background flex flex-1 flex-col py-6">
        <MaintenanceEmptyState onAdd={handleAdd} vehicleLabel={vehicleHeading} />
      </div>
    );
  }

  return (
    <div className="bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl">
        {vehicleHeading && <p className="text-body-secondary mb-4 text-sm">{vehicleHeading}</p>}
        <ItemListButton className="mb-6" label="Add Record" onClick={handleAdd} />
        {groups.map((group) => (
          <div key={group.label} className="mb-6">
            <h3 className="text-body-secondary mb-3 px-1 text-sm font-semibold">{group.label}</h3>
            <div className="space-y-3">
              {group.records.map((record) => (
                <MaintenanceItem key={record.id} record={record} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
