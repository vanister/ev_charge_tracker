import { Outlet, useLocation } from 'react-router-dom';
import { useAppUpdateAvailable } from '../../hooks/useAppUpdateAvailable';
import { LayoutConfigProvider } from '../../providers/LayoutConfigProvider';
import { AppHeader } from './AppHeader';
import { BottomTabBar } from './BottomTabBar';
import { PAGE_TRANSITION_DURATION } from '../../constants';
import { useState } from 'react';

export function Layout() {
  const location = useLocation();
  const [title, setTitle] = useState<string>('EV Charge Tracker');

  useAppUpdateAvailable();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <AppHeader title={title} />

      <main className="flex-1 pt-14 pb-24">
        <LayoutConfigProvider value={{ title, setTitle }}>
          <div
            key={location.key}
            className="animate-page-enter"
            style={{ animationDuration: `${PAGE_TRANSITION_DURATION}ms` }}
          >
            <Outlet />
          </div>
        </LayoutConfigProvider>
      </main>

      <BottomTabBar currentPath={location.pathname} />
    </div>
  );
}
