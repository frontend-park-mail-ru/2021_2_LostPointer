import router from 'services/router/router';

import routerStore from 'services/router/routerStore';
import IndexView from 'views/IndexView/indexView';
import SigninView from 'views/SigninView/signinView';
import SignupView from 'views/SignupView/signupView';
import PlaylistView from 'views/PlaylistView/playlistView';
import playlistView from 'views/PlaylistView/playlistView';
import ProfileView from 'views/ProfileView/profileView';
import ArtistView from 'views/ArtistView/artistView';
import SearchView from 'views/SearchView/searchView';
import AlbumView from 'views/AlbumView/albumView';
import FavoritesView from 'views/FavoritesView/favoritesView';

import { UserModel } from 'models/user';

import store from 'services/store/store';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './static/css/fonts.css';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';

class App {
    start() {
        UserModel.auth().then((authResponse) => {
            store.set('authenticated', authResponse.authenticated);
            store.set('userAvatar', authResponse.avatar);

            if (authResponse.authenticated) {
                UserModel.getSettings();
            }

            this._addListeners();
            this._enableServiceWorker();
            this.initRoutes();
            document.body.addEventListener('click', this._dataLinkRoute);
            router.route();
        });
    }

    _addListeners() {
        window.addEventListener(
            'click',
            playlistsContextMenu.hideContextMenu.bind(playlistsContextMenu)
        );
        window.addEventListener(
            'click',
            playlistView.removeEditWindow.bind(playlistView)
        );
        window.addEventListener(
            'click',
            playlistView.deleteButtonReset.bind(playlistView)
        );
    }

    _enableServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js', { scope: '/' })
                .then((registration) => {
                    console.log(
                        'sw registration on scope:',
                        registration.scope
                    );
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    // FIXME костыль на костыле на костыле на костыле
    _dataLinkRoute(event) {
        const target = event.target;
        if (target.tagName === 'A' && target.getAttribute('href')) {
            event.preventDefault();
            router.go(target.getAttribute('href'));
        } else {
            if (
                target.parentElement.tagName === 'A' &&
                target.parentElement.getAttribute('href')
            ) {
                event.preventDefault();
                router.go(target.parentElement.getAttribute('href'));
            } else {
                if (
                    target.parentElement.parentElement.tagName === 'A' &&
                    target.parentElement.parentElement.getAttribute('href')
                ) {
                    event.preventDefault();
                    router.go(
                        target.parentElement.parentElement.getAttribute('href')
                    );
                }
            }
        }
    }

    initRoutes() {
        router
            .register(routerStore.artist, ArtistView)
            .register(routerStore.album, AlbumView)
            .register(routerStore.favorites, FavoritesView)
            .register(routerStore.playlist, PlaylistView)
            .register(routerStore.profile, ProfileView)
            .register(routerStore.signin, SigninView)
            .register(routerStore.signup, SignupView)
            .register(routerStore.search, SearchView)
            .register(routerStore.dashboard, IndexView)
            .start();
    }
}

const app = new App();

app.start();
