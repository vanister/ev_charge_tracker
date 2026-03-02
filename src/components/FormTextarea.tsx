import clsx from 'clsx';
import { type TextareaHTMLAttributes } from 'react';

type FormTextareaProps = {
  id: string;
  label: string;
  required?: boolean;
  labelClassName?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea({
  id,
  label,
  required,
  labelClassName,
  className,
  ...textareaProps
}: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={id} className={clsx('block text-sm font-medium text-body mb-1', labelClassName)}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        required={required}
        className={clsx(
          'w-full px-3 py-2 bg-surface border border-default rounded-lg',
          'text-body placeholder-body-tertiary focus:outline-none',
          'focus:ring-2 focus:ring-primary focus:border-transparent resize-none',
          className
        )}
        {...textareaProps}
      />
    </div>
  );
}
