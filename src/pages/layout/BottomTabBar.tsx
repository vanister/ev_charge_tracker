import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../types/shared-types';

type TabItem = {
  path: string;
  label: string;
  icon: IconName;
};

const TABS: TabItem[] = [
  { path: '/', label: 'Dashboard', icon: 'home' },
  { path: '/sessions', label: 'Sessions', icon: 'zap' },
  { path: '/vehicles', label: 'Vehicles', icon: 'car' },
  { path: '/settings', label: 'Settings', icon: 'settings' }
];

type BottomTabBarProps = {
  currentPath: string;
  hidden?: boolean;
};

export function BottomTabBar(props: BottomTabBarProps) {
  const { currentPath, hidden } = props;

  return (
    <div
      className={clsx('bottom-tab-bar pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center px-4', {
        hidden
      })}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
    >
      <nav className="liquid-glass pointer-events-auto flex items-center gap-1 rounded-full p-1.5">
        {TABS.map((tab) => {
          const isActive = tab.path === '/' ? currentPath === '/' : currentPath.startsWith(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={clsx(
                'flex flex-col items-center justify-center gap-0.5 rounded-full px-4 py-2 transition-colors',
                {
                  'bg-primary/15 text-primary': isActive,
                  'text-body-secondary': !isActive
                }
              )}
            >
              <Icon name={tab.icon} size="md" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
