import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Icon } from '../../components/Icon';

type NavLink = {
  path: string;
  label: string;
  icon: 'home' | 'zap' | 'car' | 'settings';
  disabled?: boolean;
};

const navLinks: NavLink[] = [
  { path: '/', label: 'Dashboard', icon: 'home' },
  { path: '/sessions', label: 'Sessions', icon: 'zap' },
  { path: '/vehicles', label: 'Vehicles', icon: 'car', disabled: true },
  { path: '/settings', label: 'Settings', icon: 'settings', disabled: true }
];

type NavigationLinksProps = {
  currentPath: string;
  onNavigate: () => void;
};

export function NavigationLinks(props: NavigationLinksProps) {
  const { currentPath, onNavigate } = props;

  return (
    <ul className="py-4">
      {navLinks.map((link) => {
        const isActive = currentPath === link.path;
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
                onClick={onNavigate}
                className={clsx('flex items-center px-6 py-3', {
                  'text-primary bg-primary/10 font-medium': isActive,
                  'text-body-secondary': !isActive
                })}
              >
                <Icon name={link.icon} size="md" className="mr-3" />
                <span className="text-base">{link.label}</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
