importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const params = new URLSearchParams(self.location.search);
const firebaseConfig = Object.fromEntries([
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
].map((key) => [key, params.get(key) || '']));

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // FCM automatically displays notification payloads while Chrome is backgrounded.
  if (payload?.notification) return;

  const title = (payload?.notification && payload.notification.title) || (payload?.data?.type === 'contact_message' ? 'New portfolio contact message' : 'Portfolio update');
  const body = (payload?.notification && payload.notification.body) || payload?.data?.subject || 'New portfolio update';
  const clickAction = payload?.data?.target || payload?.notification?.click_action || '/owner-console-7f3a9c';

  const notificationOptions = {
    body,
    icon: payload?.notification?.icon || 'https://portfolio-full-stack-website-coral.vercel.app/logo.png',
    badge: 'https://portfolio-full-stack-website-coral.vercel.app/logo.png',
    data: { url: clickAction },
    tag: payload?.data?.messageId || 'portfolio-notification',
    renotify: true,
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/owner-console-7f3a9c';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const existingClient = clientList.find((client) => client.url.includes(targetUrl));
      if (existingClient) {
        return existingClient.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});
