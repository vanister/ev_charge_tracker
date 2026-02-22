import { useState, useEffect } from 'react';
import { useLocations } from '../../hooks/useLocations';
import { Icon } from '../../components/Icon';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingFooter } from './OnboardingFooter';
import { OnboardingNavigationButtons } from './OnboardingNavigationButtons';

type LocationFormData = {
  id: string;
  name: string;
  defaultRate: string;
};

type OnboardingStep2LocationsProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function OnboardingStep2Locations(props: OnboardingStep2LocationsProps) {
  const { updateLocation, locations } = useLocations();
  const [locationForms, setLocationForms] = useState<LocationFormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (locations.length === 0 || locationForms.length > 0) {
      return;
    }

    setLocationForms(
      locations.map((loc) => ({
        id: loc.id,
        name: loc.name,
        defaultRate: loc.defaultRate.toString()
      }))
    );
  }, [locations, locationForms.length]);

  const handleLocationFormChange = (id: string, field: 'name' | 'defaultRate', value: string) => {
    setLocationForms((prev) => prev.map((loc) => (loc.id === id ? { ...loc, [field]: value } : loc)));
    setError('');
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

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

      props.onContinue();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <OnboardingHeader
        title="Review Charging Locations"
        description="We've added common charging locations. Customize the names and rates to match your needs."
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          {locationForms.map((form, index) => {
            const location = locations.find((loc) => loc.id === form.id);
            if (!location) return null;

            return (
              <div key={form.id} className="p-4 bg-background rounded-lg border border-default">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-2">
                    <Icon name={location.icon} size="lg" color={location.color} />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <label htmlFor={`location-name-${index}`} className="block text-sm font-medium text-body mb-1">
                        Location Name
                      </label>
                      <input
                        id={`location-name-${index}`}
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => handleLocationFormChange(form.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-surface border border-default rounded-lg
                          text-body placeholder-body-tertiary focus:outline-none
                          focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Location name"
                      />
                    </div>

                    <div>
                      <label htmlFor={`location-rate-${index}`} className="block text-sm font-medium text-body mb-1">
                        Default Rate ($/kWh)
                      </label>
                      <input
                        id={`location-rate-${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={form.defaultRate}
                        onChange={(e) => handleLocationFormChange(form.id, 'defaultRate', e.target.value)}
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

        <OnboardingFooter>
          <OnboardingNavigationButtons onBack={props.onBack} continueLabel="Continue" disabled={isLoading} />
        </OnboardingFooter>
      </form>
    </div>
  );
}
