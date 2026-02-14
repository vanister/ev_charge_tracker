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
import { SessionForm } from './pages/sessions/SessionForm';

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
          <Route path="/sessions/add" element={<SessionForm />} />
          <Route path="/sessions/:id/edit" element={<SessionForm />} />

          {/* TODO: Implement Vehicles routes
          <Route path="/vehicles" element={<VehiclesListPage />} />
          <Route path="/vehicles/add" element={<VehicleFormPage />} />
          <Route path="/vehicles/:id/edit" element={<VehicleFormPage />} />
          */}

          {/* TODO: Implement Settings route
          <Route path="/settings" element={<SettingsPage />} />
          */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
