const cachedUrl = [];

const cacheName = '::losServiceWorker';
const version = 'v0.0.1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(version + cacheName).then((cache) => cache.addAll(cachedUrl)),
  );
});

self.addEventListener('fetch', (event) => {
  if (navigator.onLine === true) {
    return fetch(event.request);
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request);
      })
      .catch((err) => {
        console.error('CACHE: ', err);
      }),
  );
});
