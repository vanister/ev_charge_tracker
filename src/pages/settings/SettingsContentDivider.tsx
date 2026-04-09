import { clsx } from 'clsx';

type SettingsContentDividerProps = {
  className?: string;
};

export function SettingsContentDivider({ className }: SettingsContentDividerProps) {
  return <hr className={clsx('border-border', className)} />;
}
