import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={GenericError} onError={onError}>
      <ToastProvider>
        <DatabaseProvider db={db}>
          <ThemeProvider>
            <AppInitializationProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </AppInitializationProvider>
          </ThemeProvider>
        </DatabaseProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>
);
