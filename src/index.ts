import router from 'services/router/router';

import routerStore from 'services/router/routerStore';
import IndexView from 'views/IndexView/indexView';
import SigninView from 'views/SigninView/signinView';
import SignupView from 'views/SignupView/signupView';
import ProfileView from 'views/ProfileView/profileView';
import ArtistView from 'views/ArtistView/artistView';
import { UserModel } from 'models/user';
import store from 'services/store/store';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './static/css/fonts.css';

class App {
    start() {
        const auth = UserModel.auth().then((authResponse) => {
            store.set('authenticated', authResponse.authenticated);
            store.set('userAvatar', authResponse.avatar);
        });
        Promise.all([auth]).then(() => {
            this.initRoutes();
            document.body.addEventListener('click', this._dataLinkRoute);
            router.route();
        });
        this._enableServiceWorker();
        this.initRoutes();
        document.body.addEventListener('click', this._dataLinkRoute);
        router.route();
    }

    _enableServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
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
            .register(routerStore.artist, ArtistView)
            .register(routerStore.signin, SigninView)
            .register(routerStore.signup, SignupView)
            .register(routerStore.profile, ProfileView)
            .register(routerStore.dashboard, IndexView)
            .start();
    }
}

const app = new App();

app.start();
