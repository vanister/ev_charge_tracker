type MenuOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MenuOverlay(props: MenuOverlayProps) {
  const { isOpen, onClose } = props;

  if (!isOpen) {
    return null;
  }

  return <div className="fixed inset-0 bg-black/50 z-20" onClick={onClose} aria-label="Close menu" />;
}
