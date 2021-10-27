// наименование для нашего хранилища кэша
const CACHE_NAME = 'lostPointerCache';
// ссылки на кэшируемые файлы
const cacheUrls = [
  '/',
  '/api/v1/auth',
  '/api/v1/home',
  './src/app/SignupComponent.js',
  './src/app/AppComponent.js',
  './src/app/auth/SigninAuthForm.js',
  './src/app/auth/SignupAuthForm.js',
  './src/app/auth/InputFormComponent.js',
  './src/app/SigninComponent.js',
  './src/app/common/Track.js',
  './src/app/common/SuggestedPlaylists.js',
  './src/app/common/FriendActivity.js',
  './src/app/common/SuggestedArtists.js',
  './src/app/common/TopAlbums.js',
  './src/app/common/Sidebar.js',
  './src/app/common/PlayerComponent.js',
  './src/app/common/SuggestedPlaylist.js',
  './src/app/common/TopBar.js',
  './src/app/common/TrackList.js',
  './src/app/common/utils.js',
  './src/framework/core/component.js',
  './src/framework/core/router.js',
  './src/framework/core/routerStore.js',
  './src/framework/core/regex.js',
  './src/framework/core/app.js',
  './src/framework/appApi/request.js',
  './src/framework/appApi/requestUtils.js',
  './src/framework/validation/validation.js',
  './src/framework/validation/validityChecks.js',
  './src/index.js',
  './src/static/js/templates.precompiled.js',
  './sw.js',
  './src/static/css/dashboard.css',
  './src/static/css/signup.css',
  '.index.html',
  './src/static/img/favicon.ico',
  './src/static/img/skip.svg',
  './src/static/img/repeat.svg',
  './src/static/img/home.svg',
  './src/static/img/notifications-none.svg',
  './src/static/img/settings.svg',
  './src/static/img/volume.svg',
  './src/static/img/play-outline.svg',
  './src/static/img/favorite.svg',
  './src/static/img/more_friends.svg',
  './src/static/img/play.svg',
  './src/static/img/explore.svg',
  './src/static/img/more.svg',
  './src/static/img/signin.svg',
  './src/static/img/recents.svg',
  './src/static/img/signup.svg',
  './src/static/img/notifications.svg',
  './src/static/img/shuffle.svg',
  './src/static/img/Logo.svg',
  './src/static/img/pause.svg',
];

this.addEventListener('install', (event) => {
  // задержим обработку события
  // если произойдёт ошибка, serviceWorker не установится
  event.waitUntil(
    // находим в глобальном хранилище Cache-объект с нашим именем
    // если такого не существует, то он будет создан
    caches.open(CACHE_NAME)
      // загружаем в наш cache необходимые файлы
      .then((cache) => cache.addAll(cacheUrls))
      .catch((err) => {
        console.error('smth went wrong with caches.open: ', err);
      }),
  );
});

// eslint-disable-next-line consistent-return
this.addEventListener('fetch', (event) => {
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
