import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessions } from '../../hooks/useSessions';
import { useVehicles } from '../../hooks/useVehicles';
import { useLocations } from '../../hooks/useLocations';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useImmerState } from '../../hooks/useImmerState';
import { Button } from '../../components/Button';
import { SessionForm } from './SessionForm';
import type { SessionFormData } from './SessionForm';
import { SessionFormEmptyStates } from './SessionFormEmptyStates';
import {
  calculateCostCents,
  getDefaultDateTime,
  timestampToDatetimeLocal,
  datetimeLocalToTimestamp,
  buildSessionInput
} from './sessionFormHelpers';

type SessionPageState = SessionFormData & {
  hasManualRate: boolean;
  isLoading: boolean;
  error: string;
  isInitialized: boolean;
  sessionNotFound: boolean;
};

const NEW_SESSION: Omit<SessionPageState, 'isInitialized' | 'chargedAt'> = {
  vehicleId: '',
  locationId: '',
  energyKwh: '',
  ratePerKwh: '',
  notes: '',
  hasManualRate: false,
  isLoading: false,
  error: '',
  sessionNotFound: false
};

export function SessionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  usePageTitle(isEditMode ? 'Edit Session' : 'Add Session');

  const { getSession, createSession, updateSession } = useSessions();
  const { vehicles } = useVehicles(true);
  const { locations } = useLocations(true);

  const [formState, setFormState] = useImmerState<SessionPageState>({
    ...NEW_SESSION,
    chargedAt: getDefaultDateTime(),
    isInitialized: !isEditMode
  });

  // Initialize form with session data in edit mode
  useEffect(() => {
    if (!isEditMode || formState.isInitialized) {
      return;
    }

    // todo - move biz logic out of component and into a helper
    const loadSession = async () => {
      if (!id) {
        setFormState((draft) => {
          draft.isInitialized = true;
        });
        return;
      }

      const session = await getSession(id);

      if (!session) {
        setFormState((draft) => {
          draft.sessionNotFound = true;
          draft.isInitialized = true;
        });

        return;
      }

      setFormState((draft) => {
        draft.vehicleId = session.vehicleId;
        draft.locationId = session.locationId;
        draft.energyKwh = session.energyKwh.toString();
        draft.ratePerKwh = session.ratePerKwh.toString();
        draft.chargedAt = timestampToDatetimeLocal(session.chargedAt);
        draft.notes = session.notes || '';
        draft.hasManualRate = true;
        draft.isInitialized = true;
      });
    };

    loadSession();
  }, [isEditMode, id, getSession, formState.isInitialized, setFormState]);

  // Auto-fill rate from location's default rate
  useEffect(() => {
    if (!formState.isInitialized || !formState.locationId || formState.hasManualRate) {
      return;
    }

    const location = locations.find((l) => l.id === formState.locationId);

    if (location) {
      setFormState((draft) => {
        draft.ratePerKwh = location.defaultRate.toString();
      });
    }
  }, [formState.locationId, formState.hasManualRate, formState.isInitialized, locations, setFormState]);

  const handleChange = (field: keyof SessionFormData, value: string) => {
    setFormState((draft) => {
      draft[field] = value;

      // Changing location enables rate auto-fill; changing rate locks it to manual
      if (field === 'locationId') {
        draft.hasManualRate = false;
      } else if (field === 'ratePerKwh') {
        draft.hasManualRate = true;
      }
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState((draft) => {
      draft.isLoading = true;
      draft.error = '';
    });

    // todo - this is biz logic, move out into a helper
    try {
      const input = buildSessionInput({
        vehicleId: formState.vehicleId,
        locationId: formState.locationId,
        energyKwh: +formState.energyKwh,
        ratePerKwh: +formState.ratePerKwh,
        chargedAt: datetimeLocalToTimestamp(formState.chargedAt),
        notes: formState.notes
      });

      const result = isEditMode ? await updateSession(id, input) : await createSession(input);

      if (!result.success) {
        setFormState((draft) => {
          draft.error = result.error || 'Failed to save session';
          draft.isLoading = false;
        });
        return;
      }

      navigate('/sessions');
    } catch {
      setFormState((draft) => {
        draft.error = 'An unexpected error occurred';
        draft.isLoading = false;
      });
    }
  };

  const handleCancel = () => {
    navigate('/sessions');
  };

  const showEmptyState = (isEditMode && formState.sessionNotFound) || vehicles.length === 0 || locations.length === 0;

  if (showEmptyState) {
    return (
      <SessionFormEmptyStates
        isEditMode={isEditMode}
        sessionNotFound={formState.sessionNotFound}
        hasVehicles={vehicles.length > 0}
        hasLocations={locations.length > 0}
        onNavigate={navigate}
      />
    );
  }

  const calculatedCost = calculateCostCents(+formState.energyKwh || 0, +formState.ratePerKwh || 0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <SessionForm
        id="session-form"
        formData={formState}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={formState.isLoading}
        error={formState.error}
        vehicles={vehicles}
        locations={locations}
        calculatedCost={calculatedCost}
      />

      <div className="flex gap-3 mt-6">
        <Button type="button" variant="secondary" fullWidth onClick={handleCancel} disabled={formState.isLoading}>
          Cancel
        </Button>
        <Button form="session-form" type="submit" variant="primary" fullWidth disabled={formState.isLoading}>
          {formState.isLoading ? 'Saving...' : isEditMode ? 'Update Session' : 'Add Session'}
        </Button>
      </div>
    </div>
  );
}
