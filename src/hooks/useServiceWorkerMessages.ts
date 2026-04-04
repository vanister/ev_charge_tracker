import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type ServiceWorkerMessage = {
  type: string;
  url?: string;
};

export function useServiceWorkerMessages() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const onMessage = (event: MessageEvent<ServiceWorkerMessage>) => {
      if (event.data?.type !== 'NOTIFICATION_CLICK' || !event.data.url) {
        return;
      }

      navigate(event.data.url);
    };

    navigator.serviceWorker.addEventListener('message', onMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', onMessage);
    };
  }, [navigate]);
}
