import {
  router,
  navigateTo,
// eslint-disable-next-line import/extensions
} from './framework/core/router';

const Handlebars = require('handlebars');

Handlebars.registerHelper('render', (component) => component.getHtml());

class App {
  start() {
    this.initRoutes();
  }

  initRoutes() {
    window.addEventListener('popstate', router);
    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', (e:MouseEvent) => {
        const target = (e.target as HTMLElement);
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
