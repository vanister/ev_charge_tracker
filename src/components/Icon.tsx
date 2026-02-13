import {
  Home,
  Building,
  MapPin,
  Zap,
  Car,
  Menu,
  X,
  Plus,
  ChevronLeft,
  Settings,
  Sun,
  Moon,
  Monitor,
  Edit,
  Trash2,
  Calendar,
  Filter,
  ChevronDown
} from 'lucide-react';

export type IconName =
  | 'home'
  | 'building'
  | 'map-pin'
  | 'zap'
  | 'car'
  | 'menu'
  | 'x'
  | 'plus'
  | 'chevron-left'
  | 'settings'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'edit'
  | 'trash-2'
  | 'calendar'
  | 'filter'
  | 'chevron-down';

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

const colorClasses: Record<string, string> = {
  teal: 'text-teal-500',
  slate: 'text-slate-500',
  purple: 'text-purple-400',
  orange: 'text-orange-400'
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
    case 'menu':
      return <Menu className={combinedClassName} />;
    case 'x':
      return <X className={combinedClassName} />;
    case 'plus':
      return <Plus className={combinedClassName} />;
    case 'chevron-left':
      return <ChevronLeft className={combinedClassName} />;
    case 'settings':
      return <Settings className={combinedClassName} />;
    case 'sun':
      return <Sun className={combinedClassName} />;
    case 'moon':
      return <Moon className={combinedClassName} />;
    case 'monitor':
      return <Monitor className={combinedClassName} />;
    case 'edit':
      return <Edit className={combinedClassName} />;
    case 'trash-2':
      return <Trash2 className={combinedClassName} />;
    case 'calendar':
      return <Calendar className={combinedClassName} />;
    case 'filter':
      return <Filter className={combinedClassName} />;
    case 'chevron-down':
      return <ChevronDown className={combinedClassName} />;
    default:
      return null;
  }
}
