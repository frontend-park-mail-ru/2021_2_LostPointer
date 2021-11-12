import { Sidebar } from 'components/Sidebar/sidebar';
import Request from 'services/request/request';
import TopbarComponent, { Topbar } from 'components/Topbar/topbar';
import Player from 'components/Player/player';
import { View } from 'views/View/view';
import disableBrokenImg from 'views/utils';

import IndexTemplate from './indexView.hbs';
import './indexView.scss';
import store from 'services/store/store';
import { Homepage } from 'components/Homepage/homepagecontent';
import bus from 'services/eventbus/eventbus';

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

        return new Promise((resolve) => {
            this.homepage.getData().then(() => {
                this.homepageTemplate = this.homepage.render();
                this.isLoaded = true;
                this.authenticated = store.get('authenticated');
                resolve(true);
            });
        });
    }

    addListeners() {
        if (this.authenticated) {
            document
                .querySelector('.js-logout')
                .addEventListener('click', this.userLogout);
        }

        document
            .querySelectorAll('.track-list-item-play')
            .forEach((e) =>
                e.addEventListener('click', this.playButtonHandler)
            );
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
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
            this.didMount().then(() => {
                document.getElementById('app').innerHTML = IndexTemplate({
                    topbar: this.topbar
                        .set({
                            authenticated: store.get('authenticated'),
                            avatar: store.get('userAvatar'),
                            offline: !navigator.onLine,
                        })
                        .render(),
                    sidebar: this.sidebar,
                    content: this.homepageTemplate,
                    player: Player.render(),
                });

                Player.setEventListeners();
                this.addListeners();
                Player.setup(document.querySelectorAll('.track-list-item'));
                Player.init();
                bus.emit('home-rendered');
                this.renderedOnce = true;
            });
        }

        if (this.renderedOnce) {
            document.getElementById('content').innerHTML =
                this.homepageTemplate;
            this.homepage.addListeners();
            bus.emit('home-rendered');
            return;
        }
    }
}

export default new IndexView();
