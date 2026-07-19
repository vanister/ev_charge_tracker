import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../types/shared-types';
import { useTabHighlight } from './useTabHighlight';

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

  const activeIndex = TABS.findIndex((tab) =>
    tab.path === '/' ? currentPath === '/' : currentPath.startsWith(tab.path)
  );

  const { tabRefs, highlight } = useTabHighlight(activeIndex);

  return (
    <div
      className={clsx('bottom-tab-bar pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center px-4', {
        hidden
      })}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
    >
      <nav className="liquid-glass pointer-events-auto relative flex items-center gap-1 rounded-full p-1.5">
        <span
          className="bg-primary/15 absolute top-0 left-0 z-0 rounded-full transition-[transform,width,height] duration-200 ease-out"
          style={{
            transform: `translate(${highlight.left}px, ${highlight.top}px)`,
            width: highlight.width,
            height: highlight.height
          }}
        />

        {TABS.map((tab, index) => {
          const isActive = index === activeIndex;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              className={clsx(
                'relative z-10 flex flex-col items-center justify-center gap-0.5 rounded-full px-4 py-2 transition-colors',
                {
                  'text-primary': isActive,
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
