import { bootstrap } from './framework/index.js';
import { appModule } from './app/app.module.js';
import router from './router/router.js';

bootstrap(appModule);

const navigateTo = (url) => {
  // eslint-disable-next-line no-console
  console.log(url);
  window.history.pushState(null, null, url);
  router();
};

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.getAttribute('href'));
    }
  });
  router();
});
