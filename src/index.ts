import router from 'services/router/router';
import IndexView from 'components/IndexView/indexView';
import SigninView from 'components/SigninView/signincomponent';
import SignupView from 'components/SignupView/signupcomponent';

import routerStore from 'services/router/routerStore';

class App {
  start() {
    this.initRoutes();
    document.body.addEventListener('click', this._dataLinkRoute);
    router.route();
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
  }
}

const app = new App();

app.start();
