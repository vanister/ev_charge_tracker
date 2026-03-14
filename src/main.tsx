import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { db } from './data/db';
import { DatabaseProvider } from './providers/DatabaseProvider';
import { AppInitializationProvider } from './providers/AppInitializationProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ErrorBoundary } from 'react-error-boundary';
import { GenericError } from './components/GenericError';
import { router } from './router';

const onError = (error: unknown, info: React.ErrorInfo) => {
  console.error('Unhandled render error:', error, info);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={GenericError} onError={onError}>
      <DatabaseProvider db={db}>
        <ThemeProvider>
          <AppInitializationProvider>
            <RouterProvider router={router} />
          </AppInitializationProvider>
        </ThemeProvider>
      </DatabaseProvider>
    </ErrorBoundary>
  </StrictMode>
);
