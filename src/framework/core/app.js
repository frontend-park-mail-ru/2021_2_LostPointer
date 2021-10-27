import router from './router.js';
import { AppComponent } from '../../app/AppComponent.js';
import { SigninComponent } from '../../app/SigninComponent.js';
import { SignupComponent } from '../../app/SignupComponent.js';
import routerStore from './routerStore.js';

class App {
  start() {
    this.initRoutes();
    document.body.addEventListener('click', this._dataLinkRoute);
    router.route();
  }

  enableServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../../../sw.js', { scope: '/' })
        .then((registration) => {
          console.log('sw registration on scope:', registration.scope);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  _dataLinkRoute(event) {
    if (event.target.matches('[data-link]')) {
      event.preventDefault();
      router.go(event.target.getAttribute('href'));
    }
  }

  initRoutes() {
    router
      .register(routerStore.dashboard, AppComponent)
      .register(routerStore.signin, SigninComponent)
      .register(routerStore.signup, SignupComponent)
      .start();
  }
}

const app = new App();

function startApp() {
  app.enableServiceWorker();
  app.start();
}
export default startApp;
