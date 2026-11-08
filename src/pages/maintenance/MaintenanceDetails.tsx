import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePageConfig } from '../../hooks/usePageConfig';
import { useImmerState } from '../../hooks/useImmerState';
import { useToast } from '../../hooks/useToast';
import { useMaintenanceRecords } from '../../hooks/useMaintenanceRecords';
import { useVehicles } from '../../hooks/useVehicles';
import { Button } from '../../components/Button';
import { FormFooter } from '../../components/FormFooter';
import { EmptyState } from '../../components/EmptyState';
import { getDateGroupKey } from '../../utilities/dateUtils';
import { MaintenanceForm } from './MaintenanceForm';
import { buildRecord, getDefaultDate, getDefaultVehicleId, getSelectableVehicles } from './maintenanceFormHelpers';
import { withVehicleQuery } from './maintenanceHelpers';
import type { MaintenanceFormData } from './maintenance-types';
import type { MaintenanceType } from '../../constants';
import type { VehicleRecord } from '../../data/data-types';

type MaintenanceDetailsState = MaintenanceFormData & {
  isLoading: boolean;
  error: string;
  isInitialized: boolean;
  recordNotFound: boolean;
};

const DEFAULT_FORM_DATA: MaintenanceFormData = {
  vehicleId: '',
  type: '' as MaintenanceType,
  description: '',
  servicedAt: '',
  cost: '',
  mileage: '',
  serviceProvider: '',
  nextDueDate: '',
  nextDueMileage: '',
  notes: ''
};

export function MaintenanceDetails() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const requestedVehicleId = searchParams.get('vehicleId');
  const navigate = useNavigate();
  const isEditMode = !!id;

  usePageConfig(isEditMode ? 'Edit Service Record' : 'Add Service Record', true);

  const { getMaintenanceRecord, createMaintenanceRecord, updateMaintenanceRecord } = useMaintenanceRecords();
  const { getVehicleList } = useVehicles();
  const { showToast } = useToast();
  // undefined until loaded so the no-vehicles state doesn't flash
  const [vehicles, setVehicles] = useState<VehicleRecord[] | undefined>(undefined);

  const [formState, setFormState] = useImmerState<MaintenanceDetailsState>({
    ...DEFAULT_FORM_DATA,
    servicedAt: getDefaultDate(),
    isLoading: false,
    error: '',
    isInitialized: !isEditMode,
    recordNotFound: false
  });

  const selectableVehicles = useMemo(
    () => getSelectableVehicles(vehicles ?? [], formState.vehicleId),
    [vehicles, formState.vehicleId]
  );

  useEffect(() => {
    const loadVehicles = async () => {
      // Include inactive vehicles so an edited record's soft-deleted vehicle stays selectable
      const result = await getVehicleList(false);

      if (!result.success) {
        return;
      }

      setVehicles(result.data);

      if (isEditMode) {
        return;
      }

      setFormState((draft) => {
        draft.vehicleId = draft.vehicleId || getDefaultVehicleId(result.data, requestedVehicleId);
      });
    };

    loadVehicles();
  }, [getVehicleList, isEditMode, requestedVehicleId, setFormState]);

  useEffect(() => {
    if (!isEditMode || formState.isInitialized) {
      return;
    }

    const loadRecord = async () => {
      if (!id) {
        setFormState((draft) => {
          draft.isInitialized = true;
        });
        return;
      }

      const result = await getMaintenanceRecord(id);

      if (!result.success) {
        setFormState((draft) => {
          draft.recordNotFound = true;
          draft.isInitialized = true;
        });
        return;
      }

      const record = result.data;

      if (!record) {
        setFormState((draft) => {
          draft.recordNotFound = true;
          draft.isInitialized = true;
        });
        return;
      }

      setFormState((draft) => {
        draft.vehicleId = record.vehicleId;
        draft.type = record.type;
        draft.description = record.description ?? '';
        draft.servicedAt = getDateGroupKey(record.servicedAt);
        draft.cost = !!record.costCents ? (record.costCents / 100).toFixed(2) : '';
        draft.mileage = !!record.mileage ? `${record.mileage}` : '';
        draft.serviceProvider = record.serviceProvider ?? '';
        draft.nextDueDate = !!record.nextDueDate ? getDateGroupKey(record.nextDueDate) : '';
        draft.nextDueMileage = !!record.nextDueMileage ? `${record.nextDueMileage}` : '';
        draft.notes = record.notes ?? '';
        draft.isInitialized = true;
      });
    };

    loadRecord();
  }, [isEditMode, id, getMaintenanceRecord, formState.isInitialized, setFormState]);

  const handleChange = (field: keyof MaintenanceFormData, value: string) => {
    setFormState((draft) => {
      (draft as unknown as Record<keyof MaintenanceFormData, string>)[field] = value;
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.vehicleId) {
      setFormState((draft) => {
        draft.error = 'Please select a vehicle';
      });
      return;
    }

    setFormState((draft) => {
      draft.isLoading = true;
      draft.error = '';
    });

    const input = buildRecord(formState);
    const result =
      isEditMode && id
        ? await updateMaintenanceRecord(id, input)
        : await createMaintenanceRecord(input);

    if (!result.success) {
      setFormState((draft) => {
        draft.error = result.error;
        draft.isLoading = false;
      });
      return;
    }

    showToast({ message: isEditMode ? 'Record updated' : 'Record added', variant: 'success' });
    // Follow the saved vehicle so the record is visible when the list was filtered
    navigate(withVehicleQuery('/maintenance', requestedVehicleId && formState.vehicleId));
  };

  const handleCancel = () => {
    navigate(withVehicleQuery('/maintenance', requestedVehicleId));
  };

  const handleAddVehicle = () => {
    navigate('/settings/vehicles/add');
  };

  if (!formState.isInitialized) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-body-secondary">Loading...</div>
      </div>
    );
  }

  if (!isEditMode && !!vehicles && selectableVehicles.length === 0) {
    return (
      <EmptyState
        icon="car"
        title="No Vehicles Found"
        message="You need to add a vehicle before logging a service record."
        actionLabel="Add Your First Vehicle"
        onAction={handleAddVehicle}
      />
    );
  }

  if (formState.recordNotFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="bg-surface border-default rounded-lg border p-6 text-center">
          <p className="text-body-secondary mb-4">Record not found</p>
          <Button variant="secondary" onClick={handleCancel}>
            Back to Maintenance
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="maintenance-details mx-auto max-w-2xl px-4 pt-8 pb-20">
      <MaintenanceForm
        id="maintenance-form"
        formData={formState}
        vehicles={selectableVehicles}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={formState.isLoading}
        error={formState.error}
      />

      <FormFooter>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={handleCancel} disabled={formState.isLoading}>
            Cancel
          </Button>
          <Button form="maintenance-form" type="submit" variant="primary" fullWidth disabled={formState.isLoading}>
            {formState.isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Record'}
          </Button>
        </div>
      </FormFooter>
    </div>
  );
}
