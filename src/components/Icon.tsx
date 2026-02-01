import { Home, Building, MapPin, Zap, Car } from 'lucide-react';
import type { IconName, IconSize } from '../data/data-types';

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

const colorClasses: Record<string, string> = {
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  pink: 'text-pink-600',
  amber: 'text-amber-600'
};

export function Icon(props: IconProps) {
  const { name, size = 'md', color, className = '' } = props;

  const sizeClass = sizeClasses[size];
  const colorClass = color ? colorClasses[color] || '' : '';
  const combinedClassName = `${sizeClass} ${colorClass} ${className}`.trim();

  switch (name) {
    case 'home':
      return <Home className={combinedClassName} />;
    case 'building':
      return <Building className={combinedClassName} />;
    case 'map-pin':
      return <MapPin className={combinedClassName} />;
    case 'zap':
      return <Zap className={combinedClassName} />;
    case 'car':
      return <Car className={combinedClassName} />;
    default:
      return null;
  }
}
