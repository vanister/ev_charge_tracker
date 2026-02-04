import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { useTheme } from '../hooks/useTheme';
import type { ThemeMode } from '../types/shared-types';

type ActionButton = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type LayoutProps = {
  title: string;
  actionButton?: ActionButton;
};

type NavLink = {
  path: string;
  label: string;
  icon: 'home' | 'zap' | 'car' | 'settings';
  disabled?: boolean;
};

const navLinks: NavLink[] = [
  { path: '/', label: 'Dashboard', icon: 'home' },
  { path: '/sessions', label: 'Sessions', icon: 'zap', disabled: true },
  { path: '/vehicles', label: 'Vehicles', icon: 'car', disabled: true },
  { path: '/settings', label: 'Settings', icon: 'settings', disabled: true }
];

export function Layout(props: LayoutProps) {
  const { title, actionButton } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, updateTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleThemeChange = async (newTheme: ThemeMode) => {
    await updateTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 h-14 bg-surface border-b border-default flex items-center justify-between px-4 z-10">
        <button
          onClick={toggleMenu}
          className="w-14 h-14 -ml-4 flex items-center justify-center text-body-secondary"
          aria-label="Open menu"
        >
          <Icon name="menu" size="md" />
        </button>

        <h1 className="text-lg font-semibold text-body">{title}</h1>

        <div className="w-14 flex items-center justify-end">
          {actionButton ? (
            <button
              onClick={actionButton.onClick}
              disabled={actionButton.disabled}
              className="text-primary font-medium px-2 disabled:text-disabled"
            >
              {actionButton.label}
            </button>
          ) : (
            <div />
          )}
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={closeMenu}
          aria-label="Close menu"
        />
      )}

      <nav
        className={`fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-surface z-30 transition-transform duration-300 will-change-transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-default">
          <h2 className="text-lg font-semibold text-body">Menu</h2>
          <button
            onClick={closeMenu}
            className="w-10 h-10 -mr-2 flex items-center justify-center text-body-secondary"
            aria-label="Close menu"
          >
            <Icon name="x" size="md" />
          </button>
        </div>

        <ul className="py-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const isDisabled = link.disabled;

            return (
              <li key={link.path}>
                {isDisabled ? (
                  <div className="flex items-center px-6 py-3 text-disabled opacity-50 cursor-not-allowed">
                    <Icon name={link.icon} size="md" className="mr-3" />
                    <span className="text-base">{link.label}</span>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`flex items-center px-6 py-3 ${
                      isActive ? 'text-primary bg-primary/10 font-medium' : 'text-body-secondary'
                    }`}
                  >
                    <Icon name={link.icon} size="md" className="mr-3" />
                    <span className="text-base">{link.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="absolute bottom-0 left-0 right-0 border-t border-default p-4">
          <p className="text-xs font-medium text-muted mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-body-secondary hover:bg-primary/10'
              }`}
            >
              <Icon name="sun" size="sm" />
              <span className="text-xs">Light</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-body-secondary hover:bg-primary/10'
              }`}
            >
              <Icon name="moon" size="sm" />
              <span className="text-xs">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
                theme === 'system'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-body-secondary hover:bg-primary/10'
              }`}
            >
              <Icon name="monitor" size="sm" />
              <span className="text-xs">System</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
}
