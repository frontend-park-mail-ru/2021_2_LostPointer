import router from 'services/router/router';
import IndexView from 'components/IndexView/indexView';
import SigninView from 'components/SigninView/signincomponent';
import SignupView from 'components/SignupView/signupcomponent';

import routerStore from 'services/router/routerStore';

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
        .register(routerStore.dashboard, IndexView)
        .register(routerStore.signin, SigninView)
        .register(routerStore.signup, SignupView)
        .start();

    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', this._dataLinkRoute);
      router.check().render();
    });
  }
}

const app = new App();

app.start();
