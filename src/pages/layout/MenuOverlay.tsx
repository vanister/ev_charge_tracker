import { clsx } from 'clsx';

type MenuOverlayProps = {
  isOpen: boolean;
  onClick: () => void;
};

export function MenuOverlay(props: MenuOverlayProps) {
  const { isOpen, onClick } = props;

  return (
    <div
      className={clsx('fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ease-in-out', {
        'opacity-100 pointer-events-auto': isOpen,
        'opacity-0 pointer-events-none': !isOpen
      })}
      onClick={onClick}
      aria-label="Close menu"
      aria-hidden={!isOpen}
    />
  );
}
