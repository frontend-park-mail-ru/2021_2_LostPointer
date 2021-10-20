import {
  router,
  navigateTo,
} from './router';

class App {
  start() {
    this.initRoutes();
  }

  initRoutes() {
    window.addEventListener('popstate', router);
    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.matches('[data-link]')) {
          e.preventDefault();
          navigateTo(target.getAttribute('href'));
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
