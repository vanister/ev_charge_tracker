export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export type ToastAction = {
  label: string;
  onClick?: () => void;
  to?: string;
};

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
  persistent?: boolean;
  duration?: number;
  action?: ToastAction;
};

export type ShowToastOptions = Omit<Toast, 'id'>;
