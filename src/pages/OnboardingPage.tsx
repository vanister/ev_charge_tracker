import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocations } from '../hooks/useLocations';
import { useVehicles } from '../hooks/useVehicles';
import { useSettings } from '../hooks/useSettings';
import { Icon } from '../components/Icon';
import { Loader2 } from 'lucide-react';

type LocationFormData = {
  id: string;
  name: string;
  defaultRate: string;
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Step 2: Location editing state
  const { updateLocation, locations } = useLocations();
  const [locationForms, setLocationForms] = useState<LocationFormData[]>([]);

  // Step 3: Vehicle creation state
  const { createVehicle } = useVehicles();
  const { completeOnboarding } = useSettings();
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');

  // Initialize location forms when locations load
  useEffect(() => {
    if (currentStep === 2 && locations.length > 0 && locationForms.length === 0) {
      setLocationForms(
        locations.map((loc) => ({
          id: loc.id,
          name: loc.name,
          defaultRate: loc.defaultRate.toString()
        }))
      );
    }
  }, [currentStep, locations, locationForms.length]);

  function handleLocationFormChange(id: string, field: 'name' | 'defaultRate', value: string) {
    setLocationForms((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, [field]: value } : loc))
    );
    setError('');
  }

  function validateLocationForms(): boolean {
    for (const form of locationForms) {
      if (!form.name.trim()) {
        setError('All location names are required');
        return false;
      }
      const rate = parseFloat(form.defaultRate);
      if (isNaN(rate) || rate < 0) {
        setError('All rates must be non-negative numbers');
        return false;
      }
    }
    return true;
  }

  async function handleStep2Continue() {
    if (!validateLocationForms()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      for (const form of locationForms) {
        const location = locations.find((loc) => loc.id === form.id);
        if (!location) continue;

        const result = await updateLocation(location.id, {
          name: form.name.trim(),
          defaultRate: parseFloat(form.defaultRate)
        });

        if (!result.success) {
          setError(result.error || 'Failed to update location');
          setIsLoading(false);
          return;
        }
      }

      setCurrentStep(3);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStep3Submit(e: FormEvent) {
    e.preventDefault();

    if (!vehicleMake.trim()) {
      setError('Make is required');
      return;
    }

    if (!vehicleModel.trim()) {
      setError('Model is required');
      return;
    }

    if (!vehicleYear) {
      setError('Year is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const vehicleResult = await createVehicle({
        name: vehicleName.trim() || undefined,
        make: vehicleMake.trim(),
        model: vehicleModel.trim(),
        year: parseInt(vehicleYear, 10),
        icon: '🚗'
      });

      if (!vehicleResult.success) {
        setError(vehicleResult.error || 'Failed to create vehicle');
        setIsLoading(false);
        return;
      }

      const onboardingResult = await completeOnboarding();

      if (!onboardingResult.success) {
        setError(onboardingResult.error || 'Failed to complete onboarding');
        setIsLoading(false);
        return;
      }

      navigate('/', { replace: true });
    } catch {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Step indicator */}
        <div className="mb-6">
          <p className="text-sm text-body-secondary text-center">Step {currentStep} of 3</p>
        </div>

        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <div className="text-center">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-body mb-4">EV Charge Tracker</h1>
              <p className="text-lg text-body-secondary mb-3">
                Track your electric vehicle charging sessions with ease.
              </p>
              <p className="text-base text-body-tertiary">
                Work completely offline, manage multiple vehicles, and analyze your charging costs
                across different locations.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-lg font-medium
                  hover:bg-primary/90 transition-colors"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Step 2: Edit Location Rates */}
        {currentStep === 2 && (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-body mb-3">
                Review Charging Locations
              </h2>
              <p className="text-base text-body-secondary">
                We've added common charging locations. Customize the names and rates to match your
                needs.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {locationForms.map((form, index) => {
                const location = locations.find((loc) => loc.id === form.id);
                if (!location) return null;

                return (
                  <div key={form.id} className="p-4 bg-background rounded-lg border border-default">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-2">
                        <Icon name={location.icon} size="lg" color={location.color} />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <label
                            htmlFor={`location-name-${index}`}
                            className="block text-sm font-medium text-body mb-1"
                          >
                            Location Name
                          </label>
                          <input
                            id={`location-name-${index}`}
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                              handleLocationFormChange(form.id, 'name', e.target.value)
                            }
                            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
                                text-body placeholder-body-tertiary focus:outline-none
                                focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Location name"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`location-rate-${index}`}
                            className="block text-sm font-medium text-body mb-1"
                          >
                            Default Rate ($/kWh)
                          </label>
                          <input
                            id={`location-rate-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.defaultRate}
                            onChange={(e) =>
                              handleLocationFormChange(form.id, 'defaultRate', e.target.value)
                            }
                            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
                                text-body placeholder-body-tertiary focus:outline-none
                                focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                disabled={isLoading}
                className="px-6 py-3 bg-surface text-body border border-default rounded-lg
                    font-medium hover:bg-background transition-colors disabled:opacity-50
                    disabled:cursor-not-allowed"
              >
                Back
              </button>

              <button
                onClick={handleStep2Continue}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium
                    hover:bg-primary/90 transition-colors disabled:opacity-50
                    disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLoading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Create First Vehicle */}
        {currentStep === 3 && (
          <div>
            <div className="mb-6 text-center">
              <div className="text-5xl mb-4">🚗</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-body mb-3">Add Your Vehicle</h2>
              <p className="text-base text-body-secondary">
                Let's add your first electric vehicle to start tracking charges.
              </p>
            </div>

            <form onSubmit={handleStep3Submit} className="space-y-4">
              <div>
                <label htmlFor="vehicle-name" className="block text-sm font-medium text-body mb-1">
                  Vehicle Name
                </label>
                <input
                  id="vehicle-name"
                  type="text"
                  value={vehicleName}
                  onChange={(e) => {
                    setVehicleName(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3 py-2 bg-surface border border-default rounded-lg
                      text-body placeholder-body-tertiary focus:outline-none
                      focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="My EV"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="vehicle-make"
                    className="block text-sm font-medium text-body mb-1"
                  >
                    Make <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="vehicle-make"
                    type="text"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-default rounded-lg
                        text-body placeholder-body-tertiary focus:outline-none
                        focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tesla"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vehicle-model"
                    className="block text-sm font-medium text-body mb-1"
                  >
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="vehicle-model"
                    type="text"
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
                  onClick={() => setCurrentStep(2)}
                  disabled={isLoading}
                  className="px-6 py-3 bg-surface text-body border border-default rounded-lg
                      font-medium hover:bg-background transition-colors disabled:opacity-50
                      disabled:cursor-not-allowed"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={
                    isLoading || !vehicleMake.trim() || !vehicleModel.trim() || !vehicleYear
                  }
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
        )}
      </div>
    </div>
  );
}
