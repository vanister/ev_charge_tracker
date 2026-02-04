import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

type VehicleData = {
  name?: string;
  make: string;
  model: string;
  year: number;
  icon: string;
};

type OnboardingStep3VehicleProps = {
  onBack: () => void;
  onComplete: (vehicleData: VehicleData) => Promise<{ success: boolean; error?: string }>;
};

export function OnboardingStep3Vehicle(props: OnboardingStep3VehicleProps) {
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    const vehicleData: VehicleData = {
      name: vehicleName.trim() || undefined,
      make: vehicleMake.trim(),
      model: vehicleModel.trim(),
      year: parseInt(vehicleYear, 10),
      icon: '🚗'
    };

    try {
      const result = await props.onComplete(vehicleData);

      if (!result.success) {
        setError(result.error || 'Failed to complete setup');
        setIsLoading(false);
      }
    } catch {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="text-5xl mb-4">🚗</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-body mb-3">Add Your Vehicle</h2>
        <p className="text-base text-body-secondary">
          Let's add your first electric vehicle to start tracking charges.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
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

          <div>
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
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
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
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium
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
