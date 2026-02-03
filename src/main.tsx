import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { db } from './data/db';
import { DatabaseProvider } from './providers/DatabaseProvider';
import { AppInitializationProvider } from './providers/AppInitializationProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DatabaseProvider db={db}>
      <ThemeProvider>
        <AppInitializationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppInitializationProvider>
      </ThemeProvider>
    </DatabaseProvider>
  </StrictMode>
);
