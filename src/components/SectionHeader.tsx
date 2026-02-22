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
        'justify-between mb-4': hasTitle,
        'justify-end mb-6': !hasTitle
      })}
    >
      {title && <h2 className="text-lg font-semibold text-body">{title}</h2>}
      {action}
    </div>
  );
}
