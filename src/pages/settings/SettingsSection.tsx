import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { SectionHeader } from '../../components/SectionHeader';

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
  cardClassName?: string;
};

export function SettingsSection({ title, children, cardClassName }: SettingsSectionProps) {
  return (
    <section>
      <SectionHeader title={title} />
      <div className={clsx('p-4 bg-surface border border-default rounded-lg', cardClassName)}>
        {children}
      </div>
    </section>
  );
}
