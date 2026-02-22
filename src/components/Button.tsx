import { clsx } from 'clsx';

type ButtonProps = {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  form?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
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

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-surface text-body border border-default hover:bg-background'
  };

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'px-6 py-3 rounded-lg font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </button>
  );
}
