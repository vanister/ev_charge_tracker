import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

type ButtonProps = {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  className?: string;
};

export function Button(props: ButtonProps) {
  const {
    variant,
    children,
    onClick,
    type = 'button',
    disabled = false,
    isLoading = false,
    loadingText,
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
      onClick={onClick}
      disabled={disabled || isLoading}
      className={clsx(
        'px-6 py-3 rounded-lg font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'flex items-center justify-center gap-2',
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}
