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
};

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-surface text-body border border-default hover:bg-background'
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
    className = ''
  } = props;

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'rounded-lg px-6 py-3 font-medium transition-colors',
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
