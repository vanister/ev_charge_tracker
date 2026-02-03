import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

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

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
        <button
          onClick={toggleMenu}
          className="w-14 h-14 -ml-4 flex items-center justify-center text-gray-700"
          aria-label="Open menu"
        >
          <Icon name="menu" size="md" />
        </button>

        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

        <div className="w-14 flex items-center justify-end">
          {actionButton ? (
            <button
              onClick={actionButton.onClick}
              disabled={actionButton.disabled}
              className="text-blue-600 font-medium px-2 disabled:text-gray-400"
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
        className={`fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white z-30 transition-transform duration-300 will-change-transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={closeMenu}
            className="w-10 h-10 -mr-2 flex items-center justify-center text-gray-700"
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
                  <div className="flex items-center px-6 py-3 text-gray-400 opacity-50 cursor-not-allowed">
                    <Icon name={link.icon} size="md" className="mr-3" />
                    <span className="text-base">{link.label}</span>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`flex items-center px-6 py-3 ${
                      isActive ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700'
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
      </nav>

      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
}
