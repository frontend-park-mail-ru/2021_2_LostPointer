const cachedUrl = [];

const cacheName = '::losServiceWorker';
const version = 'v0.0.1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(version + cacheName)
            .then((cache) => cache.addAll(cachedUrl))
    );
});

const isUrlToCache = (url) => {
    const regexes = [
        /^http[s]?:\/.+\/static\/\w+\/.+\.webp$/gm,
        /^http[s]?:\/.+\/api\/v1\/artist\/\d+$/gm,
        /^http[s]?:\/.+\/api\/v1\/user\/settings$/gm,
    ];
    return regexes.reduce((prevMatch, regex) => {
        return regex.exec(url) || prevMatch;
    }, null);
};

// self.addEventListener('fetch', (event) => {
//     if (navigator.onLine === true) {
//         if (event.request.method === 'GET' && isUrlToCache(event.request.url)) {
//             caches.open(version + cacheName).then((cache) => {
//                 cache.add(event.request.url);
//             });
//         } else {
//             return fetch(event.request);
//         }
//     } else {
//         const regex1 = /^(http[s]?:\/.+\/artist)\/\d+$/gm;
//         const regex2 = /^(http[s]?:\/.+\/api\/v1\/artist)\/\d+$/gm;
//         const match1 = regex1.exec(event.request.url);
//         const match2 = regex2.exec(event.request.url);
//         if (match1 && !match2) {
//             event.respondWith(
//                 caches.match(new Request(match1[1])).then((cachedResponse) => {
//                     return cachedResponse;
//                 })
//             );
//         } else {
//             event.respondWith(
//                 caches.match(event.request).then((cachedResponse) => {
//                     if (cachedResponse) {
//                         return cachedResponse;
//                     }
//                 })
//             );
//         }
//     }
// });
