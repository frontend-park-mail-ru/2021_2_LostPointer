import { View } from 'views/View/view';
import { Sidebar } from 'components/Sidebar/sidebar';
import { AlbumModel } from 'models/album';
import { TrackList } from 'components/TrackList/tracklist';
import TopbarComponent from 'components/Topbar/topbar';
import player from 'components/Player/player';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { disableBrokenImg } from 'views/utils';

import store from 'services/store/store';

import AlbumTemplate from './albumView.hbs';
import './albumView.scss';

interface IAlbumViewProps {
    authenticated: boolean;
}

export class AlbumView extends View<IAlbumViewProps> {
    private authenticated: boolean;

    private sidebar: Sidebar;
    private userAvatar: string;
    private album: AlbumModel;
    private trackList: TrackList;

    constructor(props?: IAlbumViewProps) {
        super(props);
        this.isLoaded = false;
    }

    didMount() {
        const regex = /^\/album\/(\d+)$/gm;
        const match = regex.exec(window.location.pathname);
        if (!match) {
            router.go(routerStore.dashboard);
        }
        const albumId = match[1];

        const album = AlbumModel.getAlbum(albumId).then((album) => {
            if (!album) {
                router.go(routerStore.dashboard);
            }
            this.album = album;
        });

        Promise.all([album]).then(() => {
            this.sidebar = new Sidebar().render();
            const props = this.album.getProps();
            this.trackList = new TrackList({
                title: 'Tracks',
                tracks: props.tracks,
            }).render();
            this.isLoaded = true;
            this.render();
        });
    }

    addListeners() {
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
        this.isLoaded = false;
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = AlbumTemplate({
            sidebar: this.sidebar,
            topbar: TopbarComponent.set({
                authenticated: store.get('authenticated'),
                avatar: store.get('userAvatar'),
                offline: !navigator.onLine,
            }).render(),
            artWork:
                '/static/artworks/' +
                this.album.getProps().artwork +
                '_512px.webp',
            title: this.album.getProps().title,
            trackList: this.trackList,
            player: player.render(),
            tracksCount: this.album.getProps().tracks_count,
            tracksDurationMin: Math.floor(
                this.album.getProps().tracks_duration / 60
            ),
            tracksDurationSec: Math.floor(
                this.album.getProps().tracks_duration % 60
            ),
            album: this.album.getProps(),
        });
        TopbarComponent.addHandlers();
        TopbarComponent.didMount();
        this.addListeners();

        player.setup(document.querySelectorAll('.track-list-item'));
    }
}

export default new AlbumView();
