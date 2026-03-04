import { createContext } from 'react';
import type { ShowToastOptions, Toast } from '../types/toast-types';

type ToastContextValue = {
  toasts: Toast[];
  showToast: (options: ShowToastOptions) => string;
  dismissToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
