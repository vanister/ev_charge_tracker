import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useServiceWorkerUpdate } from '../../hooks/useServiceWorkerUpdate';
import { useTheme } from '../../hooks/useTheme';
import { LayoutConfigProvider } from '../../providers/LayoutConfigProvider';
import { UpdateNotification } from '../../components/UpdateNotification';
import { AppHeader } from './AppHeader';
import { MenuOverlay } from './MenuOverlay';
import { NavigationDrawer } from './NavigationDrawer';
import type { ThemeMode } from '../../types/shared-types';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { needsUpdate, applyUpdate } = useServiceWorkerUpdate();
  const location = useLocation();
  const { theme, updateTheme } = useTheme();
  const [title, setTitle] = useState<string>('EV Charge Tracker');

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleThemeChange = async (newTheme: ThemeMode) => {
    await updateTheme(newTheme);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title={title} onMenuOpen={handleMenuToggle} />
      <MenuOverlay isOpen={isMenuOpen} onClick={handleMenuClose} />
      <NavigationDrawer
        isOpen={isMenuOpen}
        currentPath={location.pathname}
        currentTheme={theme}
        onClose={handleMenuClose}
        onThemeChange={handleThemeChange}
      />

      <main className="pt-14 flex-1">
        <LayoutConfigProvider value={{ title, setTitle }}>
          <Outlet />
        </LayoutConfigProvider>
      </main>

      <UpdateNotification show={needsUpdate} onUpdate={applyUpdate} />
    </div>
  );
}
