import clsx from 'clsx';
import { type LucideProps } from 'lucide-react';
import { type IconName } from '../types/shared-types';
import { iconMap } from './iconMap';

type IconSize = 'sm' | 'md' | 'lg';

type IconProps = {
  name: IconName;
  size?: IconSize;
  color?: string;
  className?: string;
};

const sizeClasses: Record<IconSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export function Icon(props: IconProps) {
  const { name, size = 'md', color, className = '' } = props;

  const IconComponent: React.FC<LucideProps> | undefined = iconMap[name];

  if (!IconComponent) {
    return null;
  }

  const colorStyle = color ? { color } : undefined;

  return <IconComponent className={clsx(sizeClasses[size], className)} style={colorStyle} />;
}
