import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePageConfig } from '../../hooks/usePageConfig';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useImmerState } from '../../hooks/useImmerState';
import { useDashboardData } from './useDashboardData';
import { EmptyState } from '../../components/EmptyState';
import { Section } from '../../components/Section';
import { SessionsFilter } from '../../components/SessionsFilter';
import { ChargeStats } from './ChargeStats';
import { GasComparison } from './GasComparison';
import { ChargeSessionsCharts } from './ChargeSessionsCharts';
import { DashboardRecentSessions } from './DashboardRecentSessions';
import { MaintenanceSummary } from './MaintenanceSummary';
import type { DashboardFilter } from './dashboard-types';
import type { TimeFilterValue } from '../../types/shared-types';

export function Dashboard() {
  usePageConfig('Dashboard');

  const navigate = useNavigate();
  const { preferences, updatePreferences } = useUserPreferences();

  const [filter, setFilter] = useImmerState<DashboardFilter>({
    timeRange: (preferences.dashboardFilterTimeRange as TimeFilterValue) ?? '31d',
    vehicleId: undefined,
    locationId: undefined
  });
  const [filtersIsOpen, setFiltersIsOpen] = useState(preferences.dashboardFilterIsOpen ?? true);

  const { stats, recentSessions, chartData, vehicles, locations, hasAnySessions, gasComparison, isLoading, error } =
    useDashboardData(filter);

  // Pre-fill vehicleId from preferences once vehicle list first loads
  useEffect(() => {
    if (vehicles.length === 0) return;
    setFilter((draft) => {
      draft.vehicleId = vehicles.find((v) => v.id === preferences.dashboardFilterVehicleId)?.id;
    });
    // Only run once after vehicles first load; preferences are stable across this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles]);

  // Pre-fill locationId from preferences once location list first loads
  useEffect(() => {
    if (locations.length === 0) return;
    setFilter((draft) => {
      draft.locationId = locations.find((l) => l.id === preferences.dashboardFilterLocationId)?.id;
    });
    // Only run once after locations first load; preferences are stable across this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  useEffect(() => {
    if (error) {
      navigate('/error', { replace: true, state: { error } });
    }
  }, [error, navigate]);

  const handleTimeRangeChange = (value: TimeFilterValue) => {
    setFilter((draft) => {
      draft.timeRange = value;
    });
    updatePreferences({ dashboardFilterTimeRange: value });
  };

  const handleVehicleChange = (id: string | undefined) => {
    setFilter((draft) => {
      draft.vehicleId = id;
    });
    updatePreferences({ dashboardFilterVehicleId: id });
  };

  const handleLocationChange = (id: string | undefined) => {
    setFilter((draft) => {
      draft.locationId = id;
    });
    updatePreferences({ dashboardFilterLocationId: id });
  };

  const handleClearFilters = () => {
    setFilter((draft) => {
      draft.vehicleId = undefined;
      draft.locationId = undefined;
    });
    updatePreferences({ dashboardFilterVehicleId: undefined, dashboardFilterLocationId: undefined });
  };

  const handleFilterToggle = () => {
    setFiltersIsOpen(!filtersIsOpen);
    updatePreferences({ dashboardFilterIsOpen: !filtersIsOpen });
  };

  if (!isLoading && !hasAnySessions) {
    return (
      <div className="bg-background flex flex-1 flex-col py-6">
        <EmptyState
          icon="zap"
          title="No charging sessions yet"
          message="Add your first session to start tracking your EV charging stats."
          actionLabel="Add Session"
          onAction={() => navigate('/sessions/add')}
        />
      </div>
    );
  }

  if (isLoading || !stats || !chartData) {
    return null;
  }

  const activeVehicleId = filter.vehicleId ?? preferences.lastVehicleId ?? vehicles[0]?.id;

  return (
    <div className="bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <Section title="Charge Stats" noCard>
          {/* todo - clean the da up by wrapping SessionFilter in a DashboardSessionFilter component */}
          <SessionsFilter
            vehicles={vehicles}
            locations={locations}
            selectedVehicleId={filter.vehicleId}
            selectedLocationId={filter.locationId}
            selectedTimeRange={filter.timeRange}
            onVehicleChange={handleVehicleChange}
            onLocationChange={handleLocationChange}
            onTimeRangeChange={handleTimeRangeChange}
            onClearFilters={handleClearFilters}
            isOpen={filtersIsOpen}
            onToggle={handleFilterToggle}
            className="mb-4"
          />
          <div className="space-y-4">
            <div className="space-y-3">
              <ChargeStats stats={stats} />
              <GasComparison gasComparison={gasComparison} />
            </div>
            <ChargeSessionsCharts data={chartData} stats={stats} />
          </div>
        </Section>

        {activeVehicleId && (
          <Section
            title="Maintenance"
            action={
              <Link to="/vehicles" className="text-primary text-sm font-medium">
                View all
              </Link>
            }
            noCard
          >
            <MaintenanceSummary />
          </Section>
        )}

        {recentSessions.length > 0 && (
          <Section
            title="Recent Sessions"
            action={
              <Link to="/sessions" className="text-primary text-sm font-medium">
                View all
              </Link>
            }
            noCard
          >
            <DashboardRecentSessions sessions={recentSessions} />
          </Section>
        )}
      </div>
    </div>
  );
}
