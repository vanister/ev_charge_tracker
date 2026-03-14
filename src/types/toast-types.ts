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
  // Internal animation state — set by ToastProvider during dismiss sequence
  exiting?: boolean;
};

export type ShowToastOptions = {
  message: string;
  variant?: ToastVariant;
  persistent?: boolean;
  duration?: number;
  action?: ToastAction;
};
