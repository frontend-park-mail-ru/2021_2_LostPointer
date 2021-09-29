import router from '../../router.js';
import { appRoutes } from '../../app/app.routes.js';

class App {
  constructor() {
    this.routes = appRoutes;
  }

  start() {
    if (this.routes) {
      this.initRoutes();
    }
  }

  initRoutes() {
    window.addEventListener('popstate', this.renderRoute.bind(this));
    this.renderRoute();
  }

  renderRoute() {
    const component = router(this.routes);
    document.querySelector('.app').innerHTML = `<div class="${component.selector}"></div>`;
    component.render();
  }
}

const app = new App();

function startApp() {
  app.start();
}

export default startApp;
