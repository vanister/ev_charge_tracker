export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number | 'persistent';
  action?: {
    label: string;
    onClick: () => void;
  };
};

export type ShowToastOptions = Omit<Toast, 'id'>;
