import clsx from 'clsx';
import { type ReactNode, type SelectHTMLAttributes } from 'react';
import { Icon } from './Icon';

type FormSelectProps = {
  id: string;
  label: string;
  required?: boolean;
  labelClassName?: string;
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function FormSelect({
  id,
  label,
  required,
  labelClassName,
  className,
  children,
  ...selectProps
}: FormSelectProps) {
  return (
    <div>
      <label htmlFor={id} className={clsx('block text-sm font-medium text-body mb-1', labelClassName)}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          required={required}
          className={clsx(
            'w-full px-3 py-2 bg-surface border border-default rounded-lg',
            'text-body appearance-none focus:outline-none',
            'focus:ring-2 focus:ring-primary focus:border-transparent',
            className
          )}
          {...selectProps}
        >
          {children}
        </select>
        <Icon
          name="chevron-down"
          size="sm"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-body-secondary pointer-events-none"
        />
      </div>
    </div>
  );
}
