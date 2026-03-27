import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageConfig } from '../../../hooks/usePageConfig';
import { useImmerState } from '../../../hooks/useImmerState';
import { useToast } from '../../../hooks/useToast';
import { useMaintenanceRecords } from '../../../hooks/useMaintenanceRecords';
import { Button } from '../../../components/Button';
import { FormFooter } from '../../../components/FormFooter';
import { formatDate, timestampToDatetimeLocal } from '../../../utilities/dateUtils';
import { MaintenanceForm } from './MaintenanceForm';
import { buildRecord, getDefaultDateTime } from './maintenanceFormHelpers';
import type { MaintenanceFormData } from './maintenance-types';
import type { MaintenanceType } from '../../../constants';

type MaintenanceDetailsState = MaintenanceFormData & {
  isLoading: boolean;
  error: string;
  isInitialized: boolean;
  recordNotFound: boolean;
};

const DEFAULT_FORM_DATA: MaintenanceFormData = {
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
  const { vehicleId, id } = useParams<{ vehicleId: string; id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  usePageConfig(isEditMode ? 'Edit Service Record' : 'Add Service Record', true);

  const { getMaintenanceRecord, createMaintenanceRecord, updateMaintenanceRecord } = useMaintenanceRecords();
  const { showToast } = useToast();

  const [formState, setFormState] = useImmerState<MaintenanceDetailsState>({
    ...DEFAULT_FORM_DATA,
    servicedAt: getDefaultDateTime(),
    isLoading: false,
    error: '',
    isInitialized: !isEditMode,
    recordNotFound: false
  });

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
        draft.type = record.type;
        draft.description = record.description;
        draft.servicedAt = timestampToDatetimeLocal(record.servicedAt);
        draft.cost = !!record.costCents ? (record.costCents / 100).toFixed(2) : '';
        draft.mileage = !!record.mileage ? `${record.mileage}` : '';
        draft.serviceProvider = record.serviceProvider ?? '';
        draft.nextDueDate = !!record.nextDueDate ? formatDate(record.nextDueDate, 'yyyy-MM-dd') : '';
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

    if (!vehicleId) {
      return;
    }

    setFormState((draft) => {
      draft.isLoading = true;
      draft.error = '';
    });

    const input = buildRecord(formState, vehicleId);
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
    navigate(`/vehicles/${vehicleId}/maintenance`);
  };

  const handleCancel = () => {
    navigate(`/vehicles/${vehicleId}/maintenance`);
  };

  if (!formState.isInitialized) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-body-secondary">Loading...</div>
      </div>
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
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-20">
      <MaintenanceForm
        id="maintenance-form"
        formData={formState}
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
