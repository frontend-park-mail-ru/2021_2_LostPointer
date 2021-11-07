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
        // TODO: кэшировать некоторые запросы на бэкенд, статику
    return fetch(event.request);
    }


    const regex1 = /^(http[s]?:\/.+\/artist)\/\d+$/gm;
    const regex2 = /^(http[s]?:\/.+\/api\/v1\/artist)\/\d+$/gm;
    const match1 = regex1.exec(event.request.url);
    const match2 = regex2.exec(event.request.url)
    if (match1 && !match2) {
        event.respondWith(
            caches.match(new Request(match1[1]))
                .then((cachedResponse) => {
                            return cachedResponse;
                    })
        )
    } else {
        event.respondWith(
            caches
                .match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                })
        );
    }
});
