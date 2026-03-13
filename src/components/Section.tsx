import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { SectionHeader } from './SectionHeader';

type SectionProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  cardClassName?: string;
  // Skip the card wrapper when inner content already has its own card styling
  noCard?: boolean;
};

export function Section({ title, children, action, cardClassName, noCard }: SectionProps) {
  return (
    <section>
      <SectionHeader title={title} action={action} />
      {noCard ? (
        children
      ) : (
        <div className={clsx('p-4 bg-surface border border-default rounded-lg', cardClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}
