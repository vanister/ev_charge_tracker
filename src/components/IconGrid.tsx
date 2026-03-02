import { ALL_ICONS } from '../types/shared-types';
import { Icon, type IconName } from './Icon';

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
          className={`p-3 rounded-lg border transition-colors ${
            selectedIcon === icon
              ? 'border-primary bg-primary/10 ring-2 ring-primary text-primary'
              : 'border-default bg-surface text-body-secondary hover:border-default-hover hover:bg-background'
          }`}
        >
          <Icon name={icon} size="md" />
        </button>
      ))}
    </div>
  );
}
