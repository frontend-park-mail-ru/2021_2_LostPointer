import { View } from 'views/View/view';
import { Sidebar } from 'components/Sidebar/sidebar';
import { AlbumModel } from 'models/album';
import { TrackList } from 'components/TrackList/tracklist';
import TopbarComponent from 'components/Topbar/topbar';
import player from 'components/Player/player';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { disableBrokenImg } from 'views/utils';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu, { PlaylistsContextMenu } from 'components/ContextMenu/playlistsContextMenu';

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
    private userPlaylists: Array<PlaylistModel>;
    private contextMenu: PlaylistsContextMenu;

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

        const userPlaylists = PlaylistModel.getUserPlaylists().then(
            (playlists) => {
                this.userPlaylists = playlists;
            }
        );

        Promise.all([album, userPlaylists]).then(() => {
            this.sidebar = new Sidebar().render();
            const props = this.album.getProps();
            this.trackList = new TrackList({
                title: 'Tracks',
                tracks: props.tracks,
            }).render();
            this.contextMenu = playlistsContextMenu;
            this.contextMenu.updatePlaylists(this.userPlaylists);
            this.isLoaded = true;
            this.render();
        });
    }

    addListeners() {
        window.addEventListener('click', this.contextMenu.hideContextMenu.bind(this.contextMenu));
        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.addEventListener('click', this.contextMenu.showContextMenu.bind(this.contextMenu));
            });

        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.addEventListener(
            'click',
            this.contextMenu.createNewPlaylist.bind(this.contextMenu)
        );

        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.addEventListener('click', this.contextMenu.addTrackToPlaylist.bind(this.contextMenu));
        });

        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });

        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.removeEventListener(
                    'click',
                    this.contextMenu.showContextMenu.bind(this.contextMenu)
                );
            });
        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.removeEventListener(
            'click',
            this.contextMenu.createNewPlaylist.bind(this.contextMenu)
        );
        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.removeEventListener('click', this.contextMenu.addTrackToPlaylist.bind(this.contextMenu));
        });

        window.removeEventListener('click', this.contextMenu.hideContextMenu.bind(this.contextMenu));

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
            contextMenu: this.contextMenu.render(),
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
