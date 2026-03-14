import clsx from 'clsx';
import { type TextareaHTMLAttributes } from 'react';

type FormTextareaProps = {
  id: string;
  label: string;
  required?: boolean;
  labelClassName?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea({ id, label, required, labelClassName, className, ...textareaProps }: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={id} className={clsx('text-body mb-1 block text-sm font-medium', labelClassName)}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        required={required}
        className={clsx(
          'bg-surface border-default w-full rounded-lg border px-3 py-2',
          'text-body placeholder-body-tertiary focus:outline-none',
          'focus:ring-primary resize-none focus:border-transparent focus:ring-2',
          className
        )}
        {...textareaProps}
      />
    </div>
  );
}
