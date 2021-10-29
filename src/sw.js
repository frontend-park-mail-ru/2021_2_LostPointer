const cachedUrl = [];

const cacheName = '::losServiceWorker';
const version = 'v0.0.1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(version + cacheName).then((cache) => cache.addAll(cachedUrl)),
  );
});

// eslint-disable-next-line consistent-return
self.addEventListener('fetch', (event) => {
  /** online first */
  if (navigator.onLine === true) {
    return fetch(event.request);
  }

  /** cache first */
  event.respondWith(
    // ищем запрашиваемый ресурс в хранилище кэша
    caches
      .match(event.request)
      .then((cachedResponse) => {
        // выдаём кэш, если он есть
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request);
      })
      .catch((err) => {
        console.error('smth went wrong with caches.match: ', err);
      }),
  );
});
