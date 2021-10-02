import {
  router,
  navigateTo,
} from './router.js';

class App {
  start() {
    this.initRoutes();
  }

  initRoutes() {
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
  }
}

const app = new App();

function startApp() {
  app.start();
}
export default startApp;
