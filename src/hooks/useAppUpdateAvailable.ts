import { useCallback, useEffect, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from './useToast';

export function useAppUpdateAvailable(dontToast = false) {
  const {
    needRefresh: [needsUpdate],
    updateServiceWorker
  } = useRegisterSW();

  const { showToast } = useToast();
  const toastShownRef = useRef(false);

  const applyUpdate = useCallback(() => {
    updateServiceWorker(true);
  }, [updateServiceWorker]);

  useEffect(() => {
    if (!needsUpdate || toastShownRef.current || dontToast) {
      return;
    }

    toastShownRef.current = true;
    showToast({
      message: 'A new version is available',
      persistent: true,
      action: { label: 'View Update', to: '/settings#update' }
    });
  }, [needsUpdate, applyUpdate, showToast, dontToast]);

  return { needsUpdate, applyUpdate };
}
