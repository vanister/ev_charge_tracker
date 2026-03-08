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

const onError = (error: unknown, info: React.ErrorInfo) => {
  console.error('Unhandled render error:', error, info);
};

// Catch-all route delegates all routing to App's <Routes> tree
const router = createBrowserRouter([{ path: '*', element: <App /> }]);

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
