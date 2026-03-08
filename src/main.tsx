import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { db } from './data/db';
import { DatabaseProvider } from './providers/DatabaseProvider';
import { AppInitializationProvider } from './providers/AppInitializationProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
import { ErrorBoundary } from 'react-error-boundary';
import { GenericError } from './components/GenericError';
import { App } from './App';
import { RequireOnboarding } from './components/RequireOnboarding';
import { Layout } from './pages/layout/Layout';
import { ErrorPage } from './pages/ErrorPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Onboarding } from './pages/onboarding/Onboarding';
import { Dashboard } from './pages/dashboard/Dashboard';
import { SessionsList } from './pages/sessions/SessionsList';
import { SessionDetails } from './pages/sessions/SessionDetails';
import { VehiclesList } from './pages/vehicles/VehiclesList';
import { VehicleDetails } from './pages/vehicles/VehicleDetails';
import { Settings } from './pages/settings/Settings';
import { LocationDetails } from './pages/settings/LocationDetails';

const onError = (error: unknown, info: React.ErrorInfo) => {
  console.error('Unhandled render error:', error, info);
};

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/error', element: <ErrorPage /> },
      { path: '/onboarding', element: <Onboarding /> },
      {
        element: <RequireOnboarding />,
        children: [
          {
            element: <Layout />,
            children: [
              { path: '/', element: <Dashboard /> },
              { path: '/sessions', element: <SessionsList /> },
              { path: '/sessions/add', element: <SessionDetails /> },
              { path: '/sessions/:id/edit', element: <SessionDetails /> },
              { path: '/vehicles', element: <VehiclesList /> },
              { path: '/vehicles/add', element: <VehicleDetails /> },
              { path: '/vehicles/:id/edit', element: <VehicleDetails /> },
              { path: '/settings', element: <Settings /> },
              { path: '/settings/locations/add', element: <LocationDetails /> },
              { path: '/settings/locations/:id/edit', element: <LocationDetails /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={GenericError} onError={onError}>
      <ToastProvider>
        <DatabaseProvider db={db}>
          <ThemeProvider>
            <AppInitializationProvider>
              <RouterProvider router={router} />
            </AppInitializationProvider>
          </ThemeProvider>
        </DatabaseProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>
);
