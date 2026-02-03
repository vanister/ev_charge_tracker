import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { db } from './data/db';
import { DatabaseProvider } from './providers/DatabaseProvider';
import { AppInitializationProvider } from './providers/AppInitializationProvider';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DatabaseProvider db={db}>
      <AppInitializationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppInitializationProvider>
    </DatabaseProvider>
  </StrictMode>
);
