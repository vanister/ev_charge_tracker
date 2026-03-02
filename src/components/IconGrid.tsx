import clsx from 'clsx';

import { ALL_ICONS } from '../types/shared-types';
import { Icon } from './Icon';
import type { IconName } from '../types/shared-types';

type IconGridProps = {
  selectedIcon?: IconName;
  onIconSelect: (icon: IconName) => void;
};

export function IconGrid({ selectedIcon, onIconSelect }: IconGridProps) {
  return (
    <div role="group" aria-label="Icon selection" className="grid grid-cols-7 gap-2">
      {ALL_ICONS.map((icon) => (
        <button
          key={icon}
          type="button"
          aria-label={icon}
          onClick={() => onIconSelect(icon)}
          className={clsx('p-3 rounded-lg border transition-colors', {
            'border-primary bg-primary/10 ring-2 ring-primary text-primary': selectedIcon === icon,
            'border-default bg-surface text-body-secondary hover:border-default-hover hover:bg-background':
              selectedIcon !== icon
          })}
        >
          <Icon name={icon} size="md" />
        </button>
      ))}
    </div>
  );
}
