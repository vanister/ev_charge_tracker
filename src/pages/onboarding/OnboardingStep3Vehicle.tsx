import { useState, useEffect } from 'react';
import { useVehicles } from '../../hooks/useVehicles';
import type { Vehicle } from '../../data/data-types';
import { useImmerState } from '../../hooks/useImmerState';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingFooter } from './OnboardingFooter';
import { OnboardingNavigationButtons } from './OnboardingNavigationButtons';
import { VehicleForm } from '../vehicles/VehicleForm';
import { DEFAULT_VEHICLE_FORM_DATA, buildVehicleInput, type VehicleFormData } from '../vehicles/vehicleHelpers';

type OnboardingStep3VehicleProps = {
  onBack: () => void;
  onComplete: () => Promise<void>;
};

export function OnboardingStep3Vehicle(props: OnboardingStep3VehicleProps) {
  const { createVehicle, getVehicleList } = useVehicles();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    getVehicleList().then(setVehicles);
  }, [getVehicleList]);
  const [formData, setFormData] = useImmerState<VehicleFormData>(DEFAULT_VEHICLE_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const hasVehicles = vehicles && vehicles.length > 0;

  const handleFieldChange = (field: keyof VehicleFormData, value: string) => {
    setFormData((draft) => {
      draft[field] = value;
    });
    setError('');
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    const vehicleInput = buildVehicleInput(formData);
    const result = await createVehicle(vehicleInput);

    if (!result.success) {
      setError(result.error || 'Failed to create vehicle');
      setIsLoading(false);
      return;
    }

    await props.onComplete();
  };

  // todo - DRY this up
  if (hasVehicles) {
    return (
      <div>
        <OnboardingHeader
          title="Vehicles Ready"
          description={`You already have ${vehicles.length} vehicle${vehicles.length > 1 ? 's' : ''} in your garage.`}
        />

        <div className="space-y-3 mb-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="p-4 bg-surface border border-default rounded-lg flex items-center gap-3">
              <div className="text-3xl">{vehicle.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-body">
                  {vehicle.name || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                </div>
                {vehicle.name && (
                  <div className="text-sm text-body-secondary">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <OnboardingFooter>
          <OnboardingNavigationButtons
            onBack={props.onBack}
            continueLabel="Continue"
            type="button"
            onContinue={props.onComplete}
          />
        </OnboardingFooter>
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
        formData={formData}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />

      <OnboardingFooter>
        <OnboardingNavigationButtons
          onBack={props.onBack}
          continueLabel={isLoading ? 'Saving...' : 'Create Vehicle'}
          type="submit"
          form="onboarding-vehicle-form"
          disabled={isLoading}
        />
      </OnboardingFooter>
    </div>
  );
}
