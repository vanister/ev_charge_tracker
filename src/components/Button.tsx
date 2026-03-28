import { clsx } from 'clsx';

type ButtonProps = {
  variant: keyof typeof VARIANTS;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  form?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  'aria-label'?: string;
};

const VARIANTS = {
  primary: 'px-6 py-3 bg-primary text-white hover:bg-primary/90',
  secondary: 'px-6 py-3 bg-surface text-body border border-default hover:bg-background',
  ghost: 'p-1.5 text-body-secondary hover:text-body hover:bg-background'
};

export function Button(props: ButtonProps) {
  const {
    variant,
    children,
    onClick,
    type = 'button',
    form,
    disabled = false,
    fullWidth = false,
    className = '',
    'aria-label': ariaLabel
  } = props;

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(
        'rounded-lg font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        { 'w-full': fullWidth },
        className
      )}
    >
      {children}
    </button>
  );
}
