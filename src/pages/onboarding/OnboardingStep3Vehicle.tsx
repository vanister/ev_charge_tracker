import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useVehicles } from '../../hooks/useVehicles';
import { OnboardingHeader } from './OnboardingHeader';

type OnboardingStep3VehicleProps = {
  onBack: () => void;
  onComplete: () => Promise<void>;
};

export function OnboardingStep3Vehicle(props: OnboardingStep3VehicleProps) {
  const { createVehicle, vehicles } = useVehicles();
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const hasVehicles = vehicles && vehicles.length > 0;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    const vehicleData = {
      name: vehicleName.trim() || undefined,
      make: vehicleMake.trim(),
      model: vehicleModel.trim(),
      year: parseInt(vehicleYear, 10),
      icon: '🚗'
    };

    const result = await createVehicle(vehicleData);

    if (!result.success) {
      setError(result.error || 'Failed to create vehicle');
      setIsLoading(false);
      return;
    }

    await props.onComplete();
  };

  if (hasVehicles) {
    return (
      <div>
        <OnboardingHeader
          title="Vehicles Ready"
          description={`You already have ${vehicles.length} vehicle${vehicles.length > 1 ? 's' : ''} in your garage.`}
        />

        <div className="space-y-3 mb-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="p-4 bg-surface border border-default rounded-lg flex items-center gap-3"
            >
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

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={props.onBack}
            className="px-6 py-3 bg-surface text-body border border-default rounded-lg
              font-medium hover:bg-background transition-colors"
          >
            Back
          </button>

          <button
            type="button"
            onClick={props.onComplete}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium
              hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <OnboardingHeader
        title="Add Your Vehicle"
        description="Let's add your first electric vehicle to start tracking charges."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-8 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="vehicle-year" className="block text-sm font-medium text-body mb-1">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              id="vehicle-year"
              type="number"
              min="1900"
              max="2100"
              required
              value={vehicleYear}
              onChange={(e) => setVehicleYear(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-default rounded-lg
                text-body placeholder-body-tertiary focus:outline-none
                focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="2024"
              autoFocus
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="vehicle-make" className="block text-sm font-medium text-body mb-1">
              Make <span className="text-red-500">*</span>
            </label>
            <input
              id="vehicle-make"
              type="text"
              required
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-default rounded-lg
                text-body placeholder-body-tertiary focus:outline-none
                focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Tesla"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="vehicle-model" className="block text-sm font-medium text-body mb-1">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              id="vehicle-model"
              type="text"
              required
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-default rounded-lg
                text-body placeholder-body-tertiary focus:outline-none
                focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Model 3"
            />
          </div>
        </div>

        <div>
          <label htmlFor="vehicle-name" className="block text-sm font-medium text-body mb-1">
            Vehicle Name
          </label>
          <input
            id="vehicle-name"
            type="text"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
              text-body placeholder-body-tertiary focus:outline-none
              focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="My EV (optional)"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={props.onBack}
            disabled={isLoading}
            className="px-6 py-3 bg-surface text-body border border-default rounded-lg
              font-medium hover:bg-background transition-colors disabled:opacity-50
              disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium
              hover:bg-primary/90 transition-colors disabled:opacity-50
              disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? 'Creating...' : 'Create Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}
