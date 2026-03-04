import { useCallback, useEffect, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from './useToast';

export function useAppUpdateAvailable() {
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
    if (!needsUpdate || toastShownRef.current) {
      return;
    }

    toastShownRef.current = true;
    showToast({
      message: 'A new version is available',
      variant: 'info',
      persistent: true,
      action: { label: 'Reload', onClick: applyUpdate }
    });
  }, [needsUpdate, applyUpdate, showToast]);

  return { needsUpdate, applyUpdate };
}
