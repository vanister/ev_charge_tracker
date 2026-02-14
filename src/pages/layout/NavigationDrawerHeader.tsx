import { Icon } from '../../components/Icon';

type NavigationDrawerHeaderProps = {
  onClose: () => void;
};

export function NavigationDrawerHeader(props: NavigationDrawerHeaderProps) {
  const { onClose } = props;

  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-default">
      <h2 className="text-lg font-semibold text-body">Menu</h2>
      <button
        onClick={onClose}
        className="w-10 h-10 -mr-2 flex items-center justify-center text-body-secondary"
        aria-label="Close menu"
      >
        <Icon name="x" size="md" />
      </button>
    </div>
  );
}
