import router from './router.js';
import { AppComponent } from '../../app/AppComponent.js';
import { SigninComponent } from '../../app/SigninComponent.js';
import { SignupComponent } from '../../app/SignupComponent.js';
import routerStore from './routerStore.js';
import { ProfileView } from '../../app/ProfileView.js';

class App {
  start() {
    this.initRoutes();
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
      .register(routerStore.profile, ProfileView)
      .start();

    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', this._dataLinkRoute);
      router.check().render();
    });
  }
}

const app = new App();

function startApp() {
  app.start();
}
export default startApp;
