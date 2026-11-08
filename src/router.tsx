import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { RequireOnboarding } from './components/RequireOnboarding';
import { Layout } from './pages/layout/Layout';
import { ErrorPage } from './pages/ErrorPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Onboarding } from './pages/onboarding/Onboarding';
import { OAuthCallback } from './pages/auth/OAuthCallback';
import { Dashboard } from './pages/dashboard/Dashboard';
import { SessionsList } from './pages/sessions/SessionsList';
import { SessionDetails } from './pages/sessions/SessionDetails';
import { VehicleDetails } from './pages/settings/vehicles/VehicleDetails';
import { MaintenanceList } from './pages/maintenance/MaintenanceList';
import { MaintenanceDetails } from './pages/maintenance/MaintenanceDetails';
import { Settings } from './pages/settings/Settings';
import { LocationDetails } from './pages/settings/LocationDetails';
import { GasComparisonDetails } from './pages/settings/GasComparisonDetails';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/error', element: <ErrorPage /> },
      { path: '/onboarding', element: <Onboarding /> },
      { path: '/auth/callback', element: <OAuthCallback /> },
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
              { path: '/maintenance', element: <MaintenanceList /> },
              { path: '/maintenance/add', element: <MaintenanceDetails /> },
              { path: '/maintenance/:id/edit', element: <MaintenanceDetails /> },
              { path: '/settings', element: <Settings /> },
              { path: '/settings/vehicles/add', element: <VehicleDetails /> },
              { path: '/settings/vehicles/:id/edit', element: <VehicleDetails /> },
              { path: '/settings/locations/:id/edit', element: <LocationDetails /> },
              { path: '/settings/gas-comparison/edit', element: <GasComparisonDetails /> },
              { path: '*', element: <NotFoundPage /> }
            ]
          }
        ]
      }
    ]
  }
]);
