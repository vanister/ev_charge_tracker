import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppInitialization } from './hooks/useAppInitialization';
import { FullscreenLoader } from './components/FullscreenLoader';
import { RequireOnboarding } from './components/RequireOnboarding';
import { Layout } from './pages/layout/Layout';
import { ErrorPage } from './pages/ErrorPage';
import { Onboarding } from './pages/onboarding/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { SessionsList } from './pages/sessions/SessionsList';
import { SessionDetails } from './pages/sessions/SessionDetails';
import { VehiclesList } from './pages/vehicles/VehiclesList';
import { VehicleDetails } from './pages/vehicles/VehicleDetails';

export function App() {
  const { isInitialized, error } = useAppInitialization();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && error) {
      navigate('/error', { replace: true, state: { error } });
    }
  }, [error, isInitialized, navigate]);

  if (!isInitialized) {
    return <FullscreenLoader />;
  }

  return (
    <Routes>
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/onboarding" element={<Onboarding />} />

      <Route element={<RequireOnboarding />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sessions" element={<SessionsList />} />
          <Route path="/sessions/add" element={<SessionDetails />} />
          <Route path="/sessions/:id/edit" element={<SessionDetails />} />

          <Route path="/vehicles" element={<VehiclesList />} />
          <Route path="/vehicles/add" element={<VehicleDetails />} />
          <Route path="/vehicles/:id/edit" element={<VehicleDetails />} />

          {/* TODO: Implement Settings route
          <Route path="/settings" element={<SettingsPage />} />
          */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
