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
      <label htmlFor={id} className={clsx('text-body mb-1 block text-sm font-medium', labelClassName)}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        id={id}
        required={required}
        className={clsx(
          'bg-surface border-default w-full min-w-0 rounded-lg border px-3 py-2',
          'text-body placeholder-body-tertiary focus:outline-none',
          'focus:ring-primary focus:border-transparent focus:ring-2',
          className
        )}
        {...inputProps}
      />
    </div>
  );
}
