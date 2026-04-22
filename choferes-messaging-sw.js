importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDlzuMEutA5yDZLpRG62WEuxBQmi6y_tq0",
  authDomain: "luxridesreservas-d5102.firebaseapp.com",
  databaseURL: "https://luxridesreservas-d5102-default-rtdb.firebaseio.com",
  projectId: "luxridesreservas-d5102",
  storageBucket: "luxridesreservas-d5102.firebasestorage.app",
  messagingSenderId: "731425344327",
  appId: "1:731425344327:web:3ef04d1320750cd6e6da62"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};

  const titulo = notification.title || data.title || 'Nuevo servicio LuxRides';
  const cuerpo = notification.body || data.body || 'Hay un servicio esperando.';
  const url = data.url || data.click_action || self.location.origin + '/choferes.html';

  const opciones = {
    body: cuerpo,
    icon: self.location.origin + '/luxrides-driver-icon.svg',
    badge: self.location.origin + '/luxrides-driver-icon.svg',
    vibrate: [300, 120, 300, 120, 500],
    tag: 'luxrides-viaje-push',
    renotify: true,
    requireInteraction: true,
    data: { url: url }
  };

  return self.registration.showNotification(titulo, opciones);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data.url || self.location.origin + '/choferes.html';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
