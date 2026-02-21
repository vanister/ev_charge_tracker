import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicles } from '../../hooks/useVehicles';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useImmerState } from '../../hooks/useImmerState';
import { VehicleForm } from './VehicleForm';
import { DEFAULT_VEHICLE_FORM_DATA, buildVehicleInput, type VehicleFormData } from './vehicleHelpers';

type VehicleDetailsState = VehicleFormData & {
  isLoading: boolean;
  error: string;
  isInitialized: boolean;
  vehicleNotFound: boolean;
};

const DEFAULT_FORM_STATE: VehicleDetailsState = {
  ...DEFAULT_VEHICLE_FORM_DATA,
  isLoading: false,
  error: '',
  isInitialized: false,
  vehicleNotFound: false
};

export function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { vehicles, createVehicle, updateVehicle } = useVehicles();

  const [formState, setFormState] = useImmerState<VehicleDetailsState>({
    ...DEFAULT_FORM_STATE,
    isInitialized: !isEditMode
  });

  usePageTitle(isEditMode ? 'Edit Vehicle' : 'Add Vehicle');

  useEffect(() => {
    if (!isEditMode || formState.isInitialized) {
      return;
    }

    if (!id) {
      setFormState((draft) => {
        draft.isInitialized = true;
      });
      return;
    }

    const vehicle = vehicles.find((v) => v.id === id);

    if (!vehicle) {
      setFormState((draft) => {
        draft.vehicleNotFound = true;
        draft.isInitialized = true;
      });
      return;
    }

    setFormState((draft) => {
      draft.year = vehicle.year.toString();
      draft.make = vehicle.make;
      draft.model = vehicle.model;
      draft.name = vehicle.name || '';
      draft.icon = vehicle.icon;
      draft.isInitialized = true;
    });
  }, [isEditMode, id, vehicles, formState.isInitialized, setFormState]);

  const handleFieldChange = (field: keyof VehicleFormData, value: string) => {
    setFormState((draft) => {
      draft[field] = value;
      draft.error = '';
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormState((draft) => {
      draft.isLoading = true;
      draft.error = '';
    });

    const vehicleInput = buildVehicleInput(formState);

    const result = isEditMode ? await updateVehicle(id!, vehicleInput) : await createVehicle(vehicleInput);

    if (!result.success) {
      setFormState((draft) => {
        draft.error = result.error || 'Failed to save vehicle';
        draft.isLoading = false;
      });
      return;
    }

    navigate('/vehicles');
  };

  const handleCancel = () => {
    navigate('/vehicles');
  };

  if (!formState.isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-body-secondary">Loading...</div>
      </div>
    );
  }

  if (formState.vehicleNotFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="p-6 bg-surface border border-default rounded-lg text-center">
          <p className="text-body-secondary mb-4">Vehicle not found</p>
          <button onClick={handleCancel} className="text-primary hover:text-primary-hover font-medium">
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-body mb-6">{isEditMode ? 'Edit Vehicle' : 'Add Vehicle'}</h1>

      <VehicleForm
        formData={formState}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={formState.isLoading}
        error={formState.error}
        submitLabel={isEditMode ? 'Save Changes' : 'Add Vehicle'}
      />
    </div>
  );
}
