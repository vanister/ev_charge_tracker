import clsx from 'clsx';
import { type InputHTMLAttributes } from 'react';

type FormInputProps = {
  id: string;
  label: string;
  required?: boolean;
  labelClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormInput({ id, label, required, labelClassName, className, ...inputProps }: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className={clsx('block text-sm font-medium text-body mb-1', labelClassName)}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        required={required}
        className={clsx(
          'w-full px-3 py-2 bg-surface border border-default rounded-lg',
          'text-body placeholder-body-tertiary focus:outline-none',
          'focus:ring-2 focus:ring-primary focus:border-transparent',
          className
        )}
        {...inputProps}
      />
    </div>
  );
}
