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

const frontArtistRegex = /^(http[s]?:\/.+\/artist)\/\d+$/gm;
const frontAlbumRegex = /^(http[s]?:\/.+\/album)\/\d+$/gm;
const frontPlaylistRegex = /^(http[s]?:\/.+\/playlist)\/\d+$/gm;
const apiArtistRegex = /^http[s]?:\/.+\/api\/v1\/artist\/\d+$/gm;
const apiAlbumRegex = /^http[s]?:\/.+\/api\/v1\/album\/\d+$/gm;
const apiPlaylistRegex = /^http[s]?:\/.+\/api\/v1\/playlists\/\d+$/gm;
const apiUserPlaylistsRegex = /^http[s]?:\/.+\/api\/v1\/playlists$/gm;
const apiSettingsRegex = /^http[s]?:\/.+\/api\/v1\/user\/settings$/gm;
const staticRegex = /^http[s]?:\/.+\/static\/\w+\/.+\.webp$/gm;
const apiFavoritesRegex = /^http[s]?:\/.+\/api\/v1\/track\/favorites$/gm;

const isUrlToCache = (url) => {
    const regexes = [
        staticRegex,
        apiArtistRegex,
        apiAlbumRegex,
        apiPlaylistRegex,
        apiUserPlaylistsRegex,
        apiSettingsRegex,
        apiFavoritesRegex,
    ];
    return regexes.reduce((prevMatch, regex) => {
        return regex.exec(url) || prevMatch;
    }, null);
};

self.addEventListener('fetch', (event) => {
    if (navigator.onLine === true) {
        if (event.request.method === 'GET' && isUrlToCache(event.request.url)) {
            caches.open(version + cacheName).then((cache) => {
                cache.add(event.request.url);
            });
        } else {
            return null;
        }
    } else {
        // TODO порефакторить
        const frontArtistMatch = frontArtistRegex.exec(event.request.url);
        const frontAlbumMatch = frontAlbumRegex.exec(event.request.url);
        const frontPlaylistMatch = frontPlaylistRegex.exec(event.request.url);
        if (frontArtistMatch && !apiArtistRegex.exec(event.request.url)) {
            event.respondWith(
                caches
                    .match(new Request(frontArtistMatch[1]))
                    .then((cachedResponse) => {
                        return cachedResponse;
                    })
            );
        } else if (frontAlbumMatch && !apiAlbumRegex.exec(event.request.url)) {
            event.respondWith(
                caches
                    .match(new Request(frontAlbumMatch[1]))
                    .then((cachedResponse) => {
                        return cachedResponse;
                    })
            );
        } else if (
            frontPlaylistMatch &&
            !apiPlaylistRegex.exec(event.request.url)
        ) {
            event.respondWith(
                caches
                    .match(new Request(frontPlaylistMatch[1]))
                    .then((cachedResponse) => {
                        return cachedResponse;
                    })
            );
        } else {
            event.respondWith(
                caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                })
            );
        }
    }
});
