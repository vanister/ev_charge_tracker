import { useState, useEffect } from 'react';
import { useVehicles } from '../../hooks/useVehicles';
import type { VehicleRecord } from '../../data/data-types';
import { useImmerState } from '../../hooks/useImmerState';
import { OnboardingHeader } from './OnboardingHeader';
import { FormFooter } from '../../components/FormFooter';
import { OnboardingNavigationButtons } from './OnboardingNavigationButtons';
import { VehicleForm } from '../vehicles/VehicleForm';
import { DEFAULT_VEHICLE_FORM_DATA, type VehicleFormData } from '../vehicles/vehicleHelpers';

type OnboardingStep3VehicleProps = {
  onBack: () => void;
  onContinue: () => Promise<void>;
};

type Step3State = VehicleFormData & {
  isLoading: boolean;
  error: string;
};

const DEFAULT_STATE: Step3State = {
  ...DEFAULT_VEHICLE_FORM_DATA,
  isLoading: false,
  error: ''
};

export function OnboardingStep3Vehicle(props: OnboardingStep3VehicleProps) {
  const { createVehicle, getVehicleList } = useVehicles();
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);

  useEffect(() => {
    const loadVehicles = async () => {
      const result = await getVehicleList();

      if (result.success) {
        setVehicles(result.data);
      }
    };

    loadVehicles();
  }, [getVehicleList]);
  const [formState, setFormState] = useImmerState<Step3State>(DEFAULT_STATE);

  const hasVehicles = vehicles && vehicles.length > 0;

  const handleFieldChange = (field: keyof VehicleFormData, value: string) => {
    setFormState((draft) => {
      draft[field] = value;
      draft.error = '';
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormState((draft) => {
      draft.isLoading = true;
      draft.error = '';
    });

    const vehicleInput = {
      year: parseInt(formState.year, 10),
      make: formState.make.trim(),
      model: formState.model.trim(),
      name: formState.name.trim() || undefined,
      icon: '🚗'
    };
    const result = await createVehicle(vehicleInput);

    if (!result.success) {
      setFormState((draft) => {
        draft.error = result.error || 'Failed to create vehicle';
        draft.isLoading = false;
      });
      return;
    }

    await props.onContinue();
  };

  // todo - DRY this up
  if (hasVehicles) {
    return (
      <div>
        <OnboardingHeader
          title="Vehicles Ready"
          description={`You already have ${vehicles.length} vehicle${vehicles.length > 1 ? 's' : ''} in your garage.`}
        />

        <div className="mb-6 space-y-3">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-surface border-default flex items-center gap-3 rounded-lg border p-4">
              <div className="flex-1">
                <div className="text-body font-medium">
                  {vehicle.name || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                </div>
                {vehicle.name && (
                  <div className="text-body-secondary text-sm">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <FormFooter>
          <OnboardingNavigationButtons
            onBack={props.onBack}
            continueLabel="Continue"
            type="button"
            onContinue={props.onContinue}
          />
        </FormFooter>
      </div>
    );
  }

  return (
    <div>
      <OnboardingHeader
        title="Add Your Vehicle"
        description="Let's add your first electric vehicle to start tracking charges."
      />

      <VehicleForm
        id="onboarding-vehicle-form"
        formData={formState}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        isLoading={formState.isLoading}
        error={formState.error}
      />

      <FormFooter>
        <OnboardingNavigationButtons
          onBack={props.onBack}
          continueLabel={formState.isLoading ? 'Saving...' : 'Create Vehicle'}
          type="submit"
          form="onboarding-vehicle-form"
          disabled={formState.isLoading}
        />
      </FormFooter>
    </div>
  );
}
