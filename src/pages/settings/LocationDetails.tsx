import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocations } from '../../hooks/useLocations';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useImmerState } from '../../hooks/useImmerState';
import { Button } from '../../components/Button';
import { LocationForm } from './LocationForm';
import { DEFAULT_LOCATION_FORM_DATA, buildLocationInput, type LocationFormData } from './locationHelpers';

type LocationDetailsState = LocationFormData & {
  isLoading: boolean;
  error: string;
  isInitialized: boolean;
  locationNotFound: boolean;
};

const DEFAULT_FORM_STATE: LocationDetailsState = {
  ...DEFAULT_LOCATION_FORM_DATA,
  isLoading: false,
  error: '',
  isInitialized: false,
  locationNotFound: false
};

export function LocationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { getLocation, createLocation, updateLocation } = useLocations();

  const [formState, setFormState] = useImmerState<LocationDetailsState>({
    ...DEFAULT_FORM_STATE,
    isInitialized: !isEditMode
  });

  usePageTitle(isEditMode ? 'Edit Location' : 'Add Location');

  useEffect(() => {
    if (!isEditMode || formState.isInitialized) {
      return;
    }

    const loadLocation = async () => {
      if (!id) {
        setFormState((draft) => {
          draft.isInitialized = true;
        });
        return;
      }

      const location = await getLocation(id);

      if (!location) {
        setFormState((draft) => {
          draft.locationNotFound = true;
          draft.isInitialized = true;
        });
        return;
      }

      setFormState((draft) => {
        draft.name = location.name;
        draft.icon = location.icon;
        draft.color = location.color;
        draft.defaultRate = location.defaultRate.toString();
        draft.isInitialized = true;
      });
    };

    loadLocation();
  }, [isEditMode, id, getLocation, formState.isInitialized, setFormState]);

  const handleFieldChange = (field: keyof LocationFormData, value: string) => {
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

    const locationInput = buildLocationInput(formState);
    const result = isEditMode
      ? await updateLocation(id!, locationInput)
      : await createLocation(locationInput);

    if (!result.success) {
      setFormState((draft) => {
        draft.error = result.error || 'Failed to save location';
        draft.isLoading = false;
      });
      return;
    }

    navigate('/settings');
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  if (!formState.isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-body-secondary">Loading...</div>
      </div>
    );
  }

  if (formState.locationNotFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="p-6 bg-surface border border-default rounded-lg text-center">
          <p className="text-body-secondary mb-4">Location not found</p>
          <button onClick={handleCancel} className="text-primary hover:text-primary-hover font-medium">
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-body mb-6">
        {isEditMode ? 'Edit Location' : 'Add Location'}
      </h1>

      <LocationForm
        id="location-form"
        formData={formState}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        isLoading={formState.isLoading}
        error={formState.error}
      />

      <div className="flex gap-3 mt-6">
        <Button type="button" variant="secondary" fullWidth onClick={handleCancel} disabled={formState.isLoading}>
          Cancel
        </Button>
        <Button form="location-form" type="submit" variant="primary" fullWidth disabled={formState.isLoading}>
          {formState.isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Location'}
        </Button>
      </div>
    </div>
  );
}
