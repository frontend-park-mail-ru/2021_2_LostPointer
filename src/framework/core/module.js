import router from '../../router.js';

export class Module {
  constructor(config) {
    this.routes = config.routes;
  }

  start() {
    if (this.routes) this.initRoutes();
  }

  initRoutes() {
    window.addEventListener('popstate', this.renderRoute.bind(this));
    this.renderRoute();
  }

  renderRoute() {
    const component = router(this.routes);
    document.querySelector('.app').innerHTML = `<div class="${component.selector}"></div>`;
    this.renderComponent(component);
  }

  renderComponent(c) {
    c.render();
  }
}
