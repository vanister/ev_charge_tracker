import { useRegisterSW } from 'virtual:pwa-register/react';

export function useServiceWorkerUpdate() {
  const {
    needRefresh: [needsUpdate],
    updateServiceWorker
  } = useRegisterSW();

  const applyUpdate = () => {
    updateServiceWorker(true);
  };

  return { needsUpdate, applyUpdate };
}
