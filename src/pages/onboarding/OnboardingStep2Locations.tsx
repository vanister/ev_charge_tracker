import { useEffect } from 'react';
import { useLocations } from '../../hooks/useLocations';
import type { LocationRecord } from '../../data/data-types';
import { useImmerState } from '../../hooks/useImmerState';
import { Icon } from '../../components/Icon';
import { FormInput } from '../../components/FormInput';
import { OnboardingHeader } from './OnboardingHeader';
import { FormFooter } from '../../components/FormFooter';
import { OnboardingNavigationButtons } from './OnboardingNavigationButtons';

type OnboardingLocationFormData = {
  id: string;
  name: string;
  defaultRate: string;
};

type Step2State = {
  locations: LocationRecord[];
  locationForms: OnboardingLocationFormData[];
  isLoading: boolean;
  error: string;
};

const DEFAULT_STATE: Step2State = {
  locations: [],
  locationForms: [],
  isLoading: false,
  error: ''
};

type OnboardingStep2LocationsProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function OnboardingStep2Locations(props: OnboardingStep2LocationsProps) {
  const { updateLocation, getLocationList } = useLocations();
  const [state, setState] = useImmerState<Step2State>(DEFAULT_STATE);

  useEffect(() => {
    const loadLocations = async () => {
      const result = await getLocationList();

      if (result.success) {
        setState((draft) => {
          draft.locations = result.data;
        });
      }
    };

    loadLocations();
  }, [getLocationList, setState]);

  useEffect(() => {
    if (state.locations.length === 0 || state.locationForms.length > 0) {
      return;
    }

    setState((draft) => {
      draft.locationForms = state.locations.map((loc) => ({
        id: loc.id,
        name: loc.name,
        defaultRate: loc.defaultRate.toString()
      }));
    });
  }, [state.locations, state.locationForms.length, setState]);

  const handleLocationFormChange = (id: string, field: 'name' | 'defaultRate', value: string) => {
    setState((draft) => {
      const form = draft.locationForms.find((loc) => loc.id === id);
      if (form) {
        form[field] = value;
      }
      draft.error = '';
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState((draft) => {
      draft.isLoading = true;
      draft.error = '';
    });

    try {
      for (const form of state.locationForms) {
        const location = state.locations.find((loc) => loc.id === form.id);
        if (!location) continue;

        const result = await updateLocation(location.id, {
          name: form.name.trim(),
          defaultRate: parseFloat(form.defaultRate)
        });

        if (!result.success) {
          setState((draft) => {
            draft.error = result.error || 'Failed to update location';
            draft.isLoading = false;
          });
          return;
        }
      }

      props.onContinue();
    } catch {
      setState((draft) => {
        draft.error = 'An unexpected error occurred';
      });
    } finally {
      setState((draft) => {
        draft.isLoading = false;
      });
    }
  };

  return (
    <div>
      <OnboardingHeader
        title="Review Charging Locations"
        description="We've added common charging locations. Customize the names and rates to match your needs."
      />

      <form onSubmit={handleSubmit}>
        <div className="mb-6 space-y-4">
          {state.locationForms.map((form, index) => {
            const location = state.locations.find((loc) => loc.id === form.id);
            if (!location) return null;

            return (
              <div key={form.id} className="bg-background border-default rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-2 shrink-0">
                    <Icon name={location.icon} size="lg" color={location.color} />
                  </div>

                  <div className="flex-1 space-y-3">
                    <FormInput
                      id={`location-name-${index}`}
                      label="Location Name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => handleLocationFormChange(form.id, 'name', e.target.value)}
                      placeholder="Location name"
                    />

                    <FormInput
                      id={`location-rate-${index}`}
                      label="Default Rate ($/kWh)"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={form.defaultRate}
                      onChange={(e) => handleLocationFormChange(form.id, 'defaultRate', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {state.error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
            <p className="text-sm text-red-500">{state.error}</p>
          </div>
        )}

        <FormFooter>
          <OnboardingNavigationButtons onBack={props.onBack} continueLabel="Continue" disabled={state.isLoading} />
        </FormFooter>
      </form>
    </div>
  );
}
