import { Icon } from '../../components/Icon';

type AppHeaderProps = {
  title: string;
  onMenuOpen: () => void;
};

export function AppHeader(props: AppHeaderProps) {
  const { title, onMenuOpen } = props;

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface border-b border-default flex items-center justify-between px-4 z-10">
      <button
        onClick={onMenuOpen}
        className="w-14 h-14 -ml-4 flex items-center justify-center text-body-secondary"
        aria-label="Open menu"
      >
        <Icon name="menu" size="md" />
      </button>

      <h1 className="text-lg font-semibold text-body">{title}</h1>

      <div className="w-14" />
    </header>
  );
}
