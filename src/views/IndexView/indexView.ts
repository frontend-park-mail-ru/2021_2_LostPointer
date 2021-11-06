import { Sidebar } from 'components/Sidebar/sidebar';
import Request from 'services/request/request';
import TopbarComponent, { Topbar } from 'components/Topbar/topbar';
import Player from 'components/Player/player';
import { View } from 'views/View/view';

import IndexTemplate from './indexView.hbs';
import './indexView.scss';
import store from 'services/store/store';
import { Homepage } from 'components/Homepage/homepagecontent';
import bus from 'services/eventbus/eventbus';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';

interface IIndexViewProps {
    authenticated: boolean;
}

export class IndexView extends View<IIndexViewProps> {
    private authenticated: boolean;
    private playButtonHandler: (e) => void;
    private sidebar: Sidebar;
    private topbar: Topbar;

    private userAvatar: string;
    private renderedOnce: boolean;
    private homepage: Homepage;
    private homepageTemplate: string;

    constructor(props?: IIndexViewProps) {
        super(props);
    }

    didMount() {
        this.topbar = TopbarComponent;
        this.sidebar = new Sidebar().render();

        this.homepage = new Homepage();
        this.homepage.getData().then(() => {
            this.homepageTemplate = this.homepage.render();
            this.isLoaded = true;
            this.render();
        });
        this.authenticated = store.get('authenticated');
    }

    addListeners() {
        if (this.authenticated) {
            document
                .querySelector('.js-logout')
                .addEventListener('click', this.userLogout);
        }

        this.playButtonHandler = (e) => {
            if (e.target.className === 'track-list-item-play') {
                if (!this.authenticated) {
                    router.go(routerStore.signin);
                    return;
                }
                if (e.target === Player.nowPlaying) {
                    // Ставим на паузу/продолжаем воспр.
                    Player.toggle();
                    return;
                }
                if (Player.nowPlaying) {
                    // Переключили на другой трек
                    Player.nowPlaying.dataset.playing = 'false';
                    Player.nowPlaying.src = '/static/img/play-outline.svg';
                }

                Player.setPos(parseInt(e.target.dataset.pos, 10), e.target);

                e.target.dataset.playing = 'true';
                Player.setTrack({
                    url: `/static/tracks/${e.target.dataset.url}`,
                    cover: `/static/artworks/${e.target.dataset.cover}`,
                    title: e.target.dataset.title,
                    artist: e.target.dataset.artist,
                    artist_id: e.target.dataset.artist_id,
                    album: e.target.dataset.album,
                });
            }
        };
        Player.setup(document.querySelectorAll('.track-list-item'));
        document
            .querySelectorAll('.track-list-item-play')
            .forEach((e) =>
                e.addEventListener('click', this.playButtonHandler)
            );
    }

    unmount() {
        // document
        //     .querySelectorAll('.track-list-item-play')
        //     .forEach((e) =>
        //         e.removeEventListener('click', this.playButtonHandler)
        //     );
        // document.removeEventListener('click', this.authHandler);
        // document
        //     .querySelector('.suggested-tracks-container')
        //     .removeEventListener('click', this.playButtonHandler);
        // this.isLoaded = false;
        // this.Player.unmount();
    }

    userLogout() {
        Request.post('/user/logout').then(() => {
            Player.stop();
            this.authenticated = false;
            Player.clear();
            window.localStorage.removeItem('lastPlayedData');
            TopbarComponent.logout();
        });
    }

    render() {
        if (!this.isLoaded && !this.renderedOnce) {
            this.didMount();
            return;
        }
        if (this.renderedOnce) {
            document.getElementById('content').innerHTML =
                this.homepageTemplate;
            this.homepage.addListeners();
            bus.emit('home-rendered');
            return;
        }

        document.getElementById('app').innerHTML = IndexTemplate({
            topbar: this.topbar
                .set({
                    authenticated: store.get('authenticated'),
                    avatar: store.get('userAvatar'),
                })
                .render(),
            sidebar: this.sidebar,
            content: this.homepageTemplate,
            player: Player.render(),
        });
        this.addListeners();
        this.homepage.addListeners();

        Player.setup(document.querySelectorAll('.track-list-item'));
        Player.init();
        bus.emit('home-rendered');
        this.renderedOnce = true;
    }
}

export default new IndexView();
