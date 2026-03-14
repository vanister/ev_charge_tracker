import { createPortal } from 'react-dom';
import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed top-4 right-4 left-4 z-50 mx-auto flex max-w-md flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
      ))}
    </div>,
    document.body
  );
}
