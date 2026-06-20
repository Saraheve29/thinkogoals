// ThinkoGoals service worker — required for Chrome's "Add to Home Screen" install
// prompt to fire. Does not cache aggressively; always serves fresh from network.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
