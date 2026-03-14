import clsx from 'clsx';
import { type OptionHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import { Icon } from './Icon';

type SelectOption = {
  value: string;
  text: string;
} & Omit<OptionHTMLAttributes<HTMLOptionElement>, 'value'>;

type FormSelectProps = {
  id: string;
  label: string;
  required?: boolean;
  labelClassName?: string;
  options?: SelectOption[];
  children?: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function FormSelect({
  id,
  label,
  required,
  labelClassName,
  className,
  options,
  children,
  ...selectProps
}: FormSelectProps) {
  return (
    <div>
      <label htmlFor={id} className={clsx('text-body mb-1 block text-sm font-medium', labelClassName)}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          required={required}
          className={clsx(
            'bg-surface border-default w-full rounded-lg border px-3 py-2',
            'text-body appearance-none focus:outline-none',
            'focus:ring-primary focus:border-transparent focus:ring-2',
            className
          )}
          {...selectProps}
        >
          {children ??
            options?.map(({ text, ...optionProps }) => (
              <option key={optionProps.value} {...optionProps}>
                {text}
              </option>
            ))}
        </select>
        <Icon
          name="chevron-down"
          size="sm"
          className="text-body-secondary pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
