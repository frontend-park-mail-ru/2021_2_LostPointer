import router from 'services/router/router';

import routerStore from 'services/router/routerStore';
import IndexView from 'views/IndexView/indexView';
import SigninView from 'views/SigninView/signinView';
import SignupView from 'views/SignupView/signupView';

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
