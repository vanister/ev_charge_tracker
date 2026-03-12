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
};

export function BottomTabBar(props: BottomTabBarProps) {
  const { currentPath } = props;

  return (
    <nav
      className="bg-surface border-default fixed right-0 bottom-0 left-0 z-10 border-t"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {TABS.map((tab) => {
          const isActive = tab.path === '/' ? currentPath === '/' : currentPath.startsWith(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={clsx('flex flex-col items-center justify-center gap-0.5 py-5', 'transition-colors', {
                'text-primary': isActive,
                'text-body-secondary': !isActive
              })}
            >
              <Icon name={tab.icon} size="md" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
