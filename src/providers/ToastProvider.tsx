import { useCallback, useRef, type ReactNode } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import { ToastContainer } from '../components/ToastContainer';
import { useImmerState } from '../hooks/useImmerState';
import type { ShowToastOptions, Toast } from '../types/toast-types';

const MAX_TOASTS = 4;
const DEFAULT_DURATION = 3500;

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useImmerState<Toast[]>([]);
  const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const clearTimer = (id: string) => {
    const timer = timeouts.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timeouts.current.delete(id);
    }
  };

  const dismissToast = useCallback((id: string) => {
    clearTimer(id);

    setToasts((draft) => {
      const index = draft.findIndex((t) => t.id === id);
      if (index !== -1) draft.splice(index, 1);
    });
  }, [setToasts]);

  const showToast = useCallback((options: ShowToastOptions): string => {
    const id = crypto.randomUUID();
    const toast: Toast = { ...options, id };

    setToasts((draft) => {
      // Evict oldest non-persistent toast if at cap
      if (draft.length >= MAX_TOASTS) {
        const evictIndex = draft.findIndex((t) => t.duration !== 'persistent');
        if (evictIndex !== -1) {
          clearTimer(draft[evictIndex].id);
          draft.splice(evictIndex, 1);
        }
      }

      draft.push(toast);
    });

    const duration = options.duration ?? DEFAULT_DURATION;

    if (duration !== 'persistent') {
      const timer = setTimeout(() => dismissToast(id), duration);
      timeouts.current.set(id, timer);
    }

    return id;
  }, [setToasts, dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
