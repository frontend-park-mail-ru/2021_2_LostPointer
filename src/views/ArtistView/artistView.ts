import {View} from 'views/View/view';
import Request from 'services/request/request';
import Player, {PlayerComponent} from 'components/Player/player';
import {Sidebar} from 'components/Sidebar/sidebar';
import TopbarComponent, {Topbar} from 'components/Topbar/topbar';
import {TrackList} from 'components/TrackList/tracklist';
import {ArtistModel} from 'models/artist';

import ArtistTemplate from './artistView.hbs';
import './artistView.scss';

interface IArtistViewProps {
    authenticated: boolean;
}

export class ArtistView extends View<IArtistViewProps> {
    private authenticated: boolean;
    private authHandler: (e) => void;

    private player: PlayerComponent;
    private sidebar: Sidebar;
    private topbar: Topbar;
    private userAvatar: string;
    private artist: ArtistModel;
    private trackList: TrackList;

    constructor(props?: IArtistViewProps) {
        super(props);
        this.isLoaded = false;
        this.addHandlers();
    }

    didMount() {
        const auth = Request.get('/auth').then((response) => {
            this.authenticated = response.status === 200;
            this.userAvatar = response.avatar;
        });

        const artist = ArtistModel.getArtist('325').then((artist) => {
            console.log(artist);
            this.artist = artist;
        });

        Promise.all([auth, artist])
            .then(() => {
                this.player = Player;
                this.topbar = TopbarComponent;
                this.sidebar = new Sidebar().render();
                this.trackList = new TrackList({
                    title: 'Tracks',
                    tracks: this.artist.getProps().tracks,
                }).render();
                this.isLoaded = true;
                this.render();
            });
    }

    addListeners() {
        const video = document.querySelector('.artist__background-video');
        video.addEventListener('ended', (event) => {
            video.classList.add('transition');
        });
    }

    unmount() {
        this.isLoaded = false;
        this.player.unmount();
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
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = ArtistTemplate({
            name: this.artist.getProps().name,
            video: this.artist.getProps().video,
            artistAvatar: this.artist.getProps().avatar,
            topbar: this.topbar
                .set({
                    authenticated: this.authenticated,
                    avatar: this.userAvatar,
                })
                .render(),
            sidebar: this.sidebar,
            trackList: this.trackList,
            player: this.player.render(),
        });
        this.addListeners();
    }
}

export default new ArtistView();
