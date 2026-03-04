import { useCallback, useRef, type ReactNode } from 'react';
import { TOAST_DEFAULT_DURATION, TOAST_MAX_COUNT } from '../constants';
import { ToastContext } from '../contexts/ToastContext';
import { ToastContainer } from '../components/ToastContainer';
import { useImmerState } from '../hooks/useImmerState';
import type { ShowToastOptions, Toast } from '../types/toast-types';

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useImmerState<Toast[]>([]);
  const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>> | null>(null);

  // Lazy-initialize the ref so it's always available even if React clears it
  if (!timeouts.current) {
    timeouts.current = new Map();
  }

  const clearTimer = (id: string) => {
    const timer = timeouts.current!.get(id);

    if (!timer) {
      return;
    }

    clearTimeout(timer);
    timeouts.current!.delete(id);
  };

  const dismissToast = useCallback((id: string) => {
    clearTimer(id);

    setToasts((draft) => {
      const index = draft.findIndex((t) => t.id === id);

      if (index !== -1) {
        draft.splice(index, 1);
      }
    });
  }, [setToasts]);

  const showToast = useCallback(
    ({ persistent = false, duration = TOAST_DEFAULT_DURATION, ...rest }: ShowToastOptions): string => {
      const id = crypto.randomUUID();
      const toast: Toast = { ...rest, persistent, duration, id };

      setToasts((draft) => {
        // Evict oldest non-persistent toast if at cap
        if (draft.length >= TOAST_MAX_COUNT) {
          const evictIndex = draft.findIndex((t) => !t.persistent);

          if (evictIndex !== -1) {
            clearTimer(draft[evictIndex].id);
            draft.splice(evictIndex, 1);
          }
        }

        draft.push(toast);
      });

      if (!persistent) {
        const timer = setTimeout(() => dismissToast(id), duration);
        timeouts.current!.set(id, timer);
      }

      return id;
    },
    [setToasts, dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
