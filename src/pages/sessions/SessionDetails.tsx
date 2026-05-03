import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessions } from '../../hooks/useSessions';
import { useVehicles } from '../../hooks/useVehicles';
import { useLocations } from '../../hooks/useLocations';
import { useSettings } from '../../hooks/useSettings';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import type { VehicleRecord, LocationRecord as AppLocation } from '../../data/data-types';
import { usePageConfig } from '../../hooks/usePageConfig';
import { useImmerState } from '../../hooks/useImmerState';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/Button';
import { FormFooter } from '../../components/FormFooter';
import { SessionForm } from './SessionForm';
import type { SessionFormData } from './session-types';
import { SessionFormEmptyStates } from './SessionFormEmptyStates';
import { timestampToDatetimeLocal } from '../../utilities/dateUtils';
import {
  calculateCostCents,
  getDefaultDateTime,
  datetimeLocalToTimestamp
} from './sessionFormHelpers';
import { DEFAULT_GAS_PRICE_CENTS } from '../../constants';

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
  gasPriceStr: '',
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

  usePageConfig(isEditMode ? 'Edit Session' : 'Add Session', true);

  const { getSession, createSession, updateSession } = useSessions();
  const { getSettings } = useSettings();
  const { showToast } = useToast();
  const { getVehicleList } = useVehicles();
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const { getLocationList } = useLocations();
  const [locations, setLocations] = useState<AppLocation[]>([]);
  const { preferences, updatePreferences } = useUserPreferences();
  const [formState, setFormState] = useImmerState<SessionPageState>({
    ...NEW_SESSION,
    chargedAt: getDefaultDateTime(),
    isInitialized: !isEditMode
  });

  useEffect(() => {
    const loadVehicles = async () => {
      const result = await getVehicleList();

      if (result.success) {
        setVehicles(result.data);
      }
    };

    loadVehicles();
  }, [getVehicleList]);

  useEffect(() => {
    const loadLocations = async () => {
      const result = await getLocationList(true);

      if (result.success) {
        setLocations(result.data);
      }
    };

    loadLocations();
  }, [getLocationList]);

  useEffect(() => {
    if (isEditMode || vehicles.length === 0) {
      return;
    }

    setFormState((draft) => {
      draft.vehicleId = vehicles.find((v) => v.id === preferences.lastVehicleId)?.id ?? '';
    });
    // Only run once after the vehicle list first loads; preferences are stable across this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, vehicles]);

  useEffect(() => {
    if (isEditMode || locations.length === 0) {
      return;
    }

    setFormState((draft) => {
      draft.locationId = locations.find((l) => l.id === preferences.lastLocationId)?.id ?? '';
    });
    // Only run once after the location list first loads; preferences are stable across this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, locations]);

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    const loadGasPrice = async () => {
      const result = await getSettings();
      const priceCents =
        result.success && result.data?.gasPriceCents != null
          ? result.data.gasPriceCents
          : DEFAULT_GAS_PRICE_CENTS;

      setFormState((draft) => {
        draft.gasPriceStr = (priceCents / 100).toFixed(2);
      });
    };

    loadGasPrice();
    // Run once on mount for new sessions; getSettings is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

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

      const result = await getSession(id);

      if (!result.success) {
        setFormState((draft) => {
          draft.sessionNotFound = true;
          draft.isInitialized = true;
        });

        return;
      }

      const session = result.data;

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
        draft.energyKwh = session.energyKwh.toFixed(2);
        draft.ratePerKwh = session.ratePerKwh.toFixed(2);
        draft.gasPriceStr = ((session.gasPriceCents ?? DEFAULT_GAS_PRICE_CENTS) / 100).toFixed(2);
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
        draft.ratePerKwh = location.defaultRate.toFixed(2);
      });
    }
  }, [formState.locationId, formState.hasManualRate, formState.isInitialized, locations, setFormState]);

  const handleChange = (field: keyof SessionFormData, value: string) => {
    setFormState((draft) => {
      draft[field] = value;

      // Changing location enables rate auto-fill; changing rate locks it to manual
      switch (field) {
        case 'locationId':
          draft.hasManualRate = false;
          break;
        case 'ratePerKwh':
          draft.hasManualRate = true;
          break;
        default:
          break;
      }
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormState((draft) => {
      draft.isLoading = true;
      draft.error = '';
    });

    try {
      const input = {
        vehicleId: formState.vehicleId,
        locationId: formState.locationId,
        energyKwh: +formState.energyKwh,
        ratePerKwh: +formState.ratePerKwh,
        gasPriceCents: formState.gasPriceStr ? Math.round(+formState.gasPriceStr * 100) : undefined,
        chargedAt: datetimeLocalToTimestamp(formState.chargedAt),
        notes: formState.notes.trim() || undefined
      };

      const result = isEditMode ? await updateSession(id, input) : await createSession(input);

      if (!result.success) {
        setFormState((draft) => {
          draft.error = result.error || 'Failed to save session';
          draft.isLoading = false;
        });
        return;
      }

      updatePreferences({
        lastVehicleId: formState.vehicleId,
        lastLocationId: formState.locationId
      });

      showToast({ message: isEditMode ? 'Session updated' : 'Session added', variant: 'success' });
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
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-20">
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

      <FormFooter>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={handleCancel} disabled={formState.isLoading}>
            Cancel
          </Button>
          <Button form="session-form" type="submit" variant="primary" fullWidth disabled={formState.isLoading}>
            {formState.isLoading ? 'Saving...' : isEditMode ? 'Update Session' : 'Add Session'}
          </Button>
        </div>
      </FormFooter>
    </div>
  );
}
