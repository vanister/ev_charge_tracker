self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.visibilityState === 'visible' || client.focused) {
          client.postMessage({ type: 'NOTIFICATION_CLICK', url: targetUrl });
          return client.focus();
        }
      }

      // No visible window — try to focus any existing one
      if (windowClients.length > 0) {
        const client = windowClients[0];
        client.postMessage({ type: 'NOTIFICATION_CLICK', url: targetUrl });
        return client.focus();
      }

      // No window at all — open a new one
      return self.clients.openWindow(targetUrl);
    })
  );
});
