import { clsx } from 'clsx';
import { Icon } from './Icon';

type ItemListButtonProps = {
  className?: string;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
};

const variantClasses: Record<NonNullable<ItemListButtonProps['variant']>, string> = {
  primary: 'bg-primary border-primary hover:bg-primary-hover',
  secondary: 'bg-secondary border-secondary hover:opacity-90',
  accent: 'bg-accent border-accent hover:opacity-90'
};

export function ItemListButton(props: ItemListButtonProps) {
  const { label, onClick, variant = 'primary', className } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full cursor-pointer rounded-lg border p-4 transition-all',
        'flex items-center justify-center gap-2 text-white',
        variantClasses[variant],
        className
      )}
    >
      <Icon name="plus" size="sm" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
