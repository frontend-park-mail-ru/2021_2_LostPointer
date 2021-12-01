import { View } from 'views/View/view';
import sidebar from 'components/Sidebar/sidebar';
import { AlbumModel } from 'models/album';
import { TrackList } from 'components/TrackList/tracklist';
import TopbarComponent from 'components/Topbar/topbar';
import player from 'components/Player/player';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { disableBrokenImg } from 'views/utils';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import mobile from 'components/Mobile/mobile';
import store from 'services/store/store';

import AlbumTemplate from './albumView.hbs';
import './albumView.scss';

interface IAlbumViewProps {
    authenticated: boolean;
}

export class AlbumView extends View<IAlbumViewProps> {
    private userAvatar: string;
    private album: AlbumModel;
    private trackList: TrackList;
    private userPlaylists: Array<PlaylistModel>;

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
            const props = this.album.getProps();
            this.trackList = new TrackList({
                title: 'Tracks',
                tracks: props.tracks,
            }).render();
            playlistsContextMenu.updatePlaylists(this.userPlaylists);
            this.isLoaded = true;
            this.render();
        });
    }

    addListeners() {
        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.addEventListener(
                    'click',
                    playlistsContextMenu.showContextMenu.bind(
                        playlistsContextMenu
                    )
                );
            });

        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.addEventListener(
            'click',
            playlistsContextMenu.createNewPlaylist.bind(playlistsContextMenu)
        );

        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.addEventListener(
                'click',
                playlistsContextMenu.addTrackToPlaylist.bind(
                    playlistsContextMenu
                )
            );
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
                    playlistsContextMenu.showContextMenu.bind(
                        playlistsContextMenu
                    )
                );
            });
        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        if (createPlaylistBtn) {
            createPlaylistBtn.removeEventListener(
                'click',
                playlistsContextMenu.createNewPlaylist.bind(playlistsContextMenu)
            );
        }
        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.removeEventListener(
                'click',
                playlistsContextMenu.addTrackToPlaylist.bind(
                    playlistsContextMenu
                )
            );
        });

        this.isLoaded = false;
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = AlbumTemplate({
            sidebar: sidebar.render(),
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
            contextMenu: playlistsContextMenu.render(),
            tracksCount: this.album.getProps().tracks_count,
            tracksDurationMin: Math.floor(
                this.album.getProps().tracks_duration / 60
            ),
            tracksDurationSec: Math.floor(
                this.album.getProps().tracks_duration % 60
            ),
            album: this.album.getProps(),
            player: player.render(),
            mobile: mobile.render(),
        });
        TopbarComponent.addHandlers();
        TopbarComponent.didMount();
        this.addListeners();

        player.setEventListeners();
        player.setup(document.querySelectorAll('.track'));
    }
}

export default new AlbumView();
