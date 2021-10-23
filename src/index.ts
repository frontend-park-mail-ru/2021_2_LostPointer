import {
  router,
  navigateTo,
} from 'services/router/router';

import Handlebars from 'handlebars';

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

export const app = new App();

app.start();

