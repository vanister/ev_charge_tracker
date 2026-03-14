import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title?: string;
  action?: ReactNode;
};

export function SectionHeader({ title, action }: SectionHeaderProps) {
  const hasTitle = !!title;

  return (
    <div
      className={clsx('flex items-center', {
        'mb-4 justify-between': hasTitle,
        'mb-6 justify-end': !hasTitle
      })}
    >
      {title && <h2 className="text-body text-lg font-semibold">{title}</h2>}
      {action}
    </div>
  );
}
