import { Sidebar } from 'components/Sidebar/sidebar';
import Request from 'services/request/request';
import TopbarComponent, { Topbar } from 'components/Topbar/topbar';
import Player, { PlayerComponent } from 'components/Player/player';
import { View } from 'views/View/view';

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
    private authHandler: (e) => void;
    private playButtonHandler: (e) => void;

    private player: PlayerComponent;
    private sidebar: Sidebar;
    private topbar: Topbar;

    private userAvatar: string;
    private renderedOnce: boolean;
    private homepage: Homepage;
    private homepageTemplate: string;

    constructor(props?: IIndexViewProps) {
        super(props);
        this.addHandlers();
    }

    didMount() {
        this.player = Player;
        this.topbar = TopbarComponent;
        this.sidebar = new Sidebar().render();

        this.homepage = new Homepage();
        this.homepage.getData().then(() => {
            this.homepageTemplate = this.homepage.render();
            this.isLoaded = true;
            this.render();
        });
    }

    addListeners() {
        document.addEventListener('click', this.authHandler);
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
        // this.player.unmount();
    }

    addHandlers() {
        this.authHandler = (e) => {
            if (
                e.target.className === 'topbar-auth' &&
                e.target.dataset.action === 'logout'
            ) {
                Request.post('/user/logout').then(() => {
                    this.player.stop();
                    this.authenticated = false;
                    this.props.authenticated = false;
                    this.player.clear();
                    window.localStorage.removeItem('lastPlayedData');
                    this.topbar.logout();
                });
            }
        };
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
            player: this.player.render(),
        });
        this.addListeners();
        this.homepage.addListeners();

        this.player.setup(document.querySelectorAll('.track-list-item'));
        bus.emit('home-rendered');
        this.renderedOnce = true;
    }
}

export default new IndexView();
