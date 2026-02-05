import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppInitialization } from './hooks/useAppInitialization';
import { InitializationLoading } from './components/InitializationLoading';
import { RequireOnboarding } from './components/RequireOnboarding';
import { Layout } from './components/Layout';
import { ErrorPage } from './pages/ErrorPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { Dashboard } from './pages/Dashboard';

export function App() {
  const { isInitialized, error } = useAppInitialization();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && error) {
      navigate('/error', { replace: true, state: { error } });
    }
  }, [error, isInitialized, navigate]);

  if (!isInitialized) {
    return <InitializationLoading />;
  }

  return (
    <Routes>
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route element={<RequireOnboarding />}>
        <Route path="/" element={<Layout title="Dashboard" />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* TODO: Implement Sessions routes
          <Route path="/sessions" element={<Layout title="Sessions" />}>
            <Route index element={<SessionsListPage />} />
          </Route>
          <Route path="/sessions/add" element={<Layout title="Add Session" />}>
            <Route index element={<SessionFormPage />} />
          </Route>
          <Route path="/sessions/:id/edit" element={<Layout title="Edit Session" />}>
            <Route index element={<SessionFormPage />} />
          </Route>
          */}

        {/* TODO: Implement Vehicles routes
          <Route path="/vehicles" element={<Layout title="Vehicles" />}>
            <Route index element={<VehiclesListPage />} />
          </Route>
          <Route path="/vehicles/add" element={<Layout title="Add Vehicle" />}>
            <Route index element={<VehicleFormPage />} />
          </Route>
          <Route path="/vehicles/:id/edit" element={<Layout title="Edit Vehicle" />}>
            <Route index element={<VehicleFormPage />} />
          </Route>
          */}

        {/* TODO: Implement Settings route
          <Route path="/settings" element={<Layout title="Settings" />}>
            <Route index element={<SettingsPage />} />
          </Route>
          */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
