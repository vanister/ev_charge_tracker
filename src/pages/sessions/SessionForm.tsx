import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessions } from '../../hooks/useSessions';
import { useVehicles } from '../../hooks/useVehicles';
import { useLocations } from '../../hooks/useLocations';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useImmerState } from '../../hooks/useImmerState';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { SessionFormEmptyStates } from './SessionFormEmptyStates';
import { formatCost } from '../../utilities/formatUtils';
import { getVehicleDisplayName } from './sessionHelpers';
import {
  timestampToDatetimeLocal,
  datetimeLocalToTimestamp,
  calculateCostCents,
  getDefaultDateTime,
  buildSessionInput
} from './sessionFormHelpers';

type SessionFormState = {
  vehicleId: string;
  locationId: string;
  energyKwh: string;
  ratePerKwh: string;
  chargedAt: string;
  notes: string;
  hasManualRate: boolean;
  isLoading: boolean;
  error: string;
  isInitialized: boolean;
  sessionNotFound: boolean;
};

const NEW_SESSION: Omit<SessionFormState, 'isInitialized' | 'chargedAt'> = {
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

export function SessionForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  usePageTitle(isEditMode ? 'Edit Session' : 'Add Session');

  const { getSession, createSession, updateSession } = useSessions();
  const { vehicles } = useVehicles(true);
  const { locations } = useLocations(true);

  const [formState, setFormState] = useImmerState<SessionFormState>({
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

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((draft) => {
      draft.ratePerKwh = e.target.value;
      draft.hasManualRate = true;
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState((draft) => {
      draft.locationId = e.target.value;
      draft.hasManualRate = false;
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

  // todo - unify styling of form with other forms in the app, move styles into reusable components where possible
  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="vehicle" className="block text-sm font-medium text-body mb-1">
            Vehicle <span className="text-red-500">*</span>
          </label>
          <select
            id="vehicle"
            required
            value={formState.vehicleId}
            onChange={(e) =>
              setFormState((draft) => {
                draft.vehicleId = e.target.value;
              })
            }
            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
              text-body appearance-none focus:outline-none focus:ring-2
              focus:ring-primary focus:border-transparent"
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {getVehicleDisplayName(vehicle)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-body mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="location"
              required
              value={formState.locationId}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 bg-surface border border-default rounded-lg
                text-body appearance-none focus:outline-none focus:ring-2
                focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              size="sm"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-body-secondary pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="energy" className="block text-sm font-medium text-body mb-1">
            Energy (kWh) <span className="text-red-500">*</span>
          </label>
          <input
            id="energy"
            type="number"
            required
            step="0.01"
            min="0.01"
            value={formState.energyKwh}
            onChange={(e) =>
              setFormState((draft) => {
                draft.energyKwh = e.target.value;
              })
            }
            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
              text-body placeholder-body-tertiary focus:outline-none
              focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-body mb-1">
            Rate ($/kWh) <span className="text-red-500">*</span>
          </label>
          <input
            id="rate"
            type="number"
            required
            step="0.001"
            min="0.001"
            value={formState.ratePerKwh}
            onChange={handleRateChange}
            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
              text-body placeholder-body-tertiary focus:outline-none
              focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.000"
          />
        </div>

        <div>
          <label htmlFor="charged-at" className="block text-sm font-medium text-body mb-1">
            Charged At <span className="text-red-500">*</span>
          </label>
          <input
            id="charged-at"
            type="datetime-local"
            required
            value={formState.chargedAt}
            onChange={(e) =>
              setFormState((draft) => {
                draft.chargedAt = e.target.value;
              })
            }
            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
              text-body placeholder-body-tertiary focus:outline-none
              focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-body mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formState.notes}
            onChange={(e) =>
              setFormState((draft) => {
                draft.notes = e.target.value;
              })
            }
            className="w-full px-3 py-2 bg-surface border border-default rounded-lg
              text-body placeholder-body-tertiary focus:outline-none
              focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Add any notes about this charging session..."
          />
        </div>

        <div className="p-4 bg-background border border-default rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-body-secondary">Estimated Cost:</span>
            <span className="text-lg font-semibold text-primary">{formatCost(calculatedCost)}</span>
          </div>
        </div>

        {formState.error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{formState.error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={handleCancel} disabled={formState.isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" fullWidth disabled={formState.isLoading}>
            {formState.isLoading ? 'Saving...' : isEditMode ? 'Update Session' : 'Add Session'}
          </Button>
        </div>
      </form>
    </div>
  );
}
