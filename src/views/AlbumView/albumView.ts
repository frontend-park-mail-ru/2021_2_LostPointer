import { View } from 'views/View/view';
import { Sidebar } from 'components/Sidebar/sidebar';
import { AlbumModel } from 'models/album';
import { TrackList } from 'components/TrackList/tracklist';
import TopbarComponent from 'components/Topbar/topbar';
import player from 'components/Player/player';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { addTrackToPlaylist, createNewPlaylist, disableBrokenImg, hideContextMenu, showContextMenu } from 'views/utils';
import { PlaylistModel } from 'models/playlist';
import { ContextMenu } from 'components/ContextMenu/contextMenu';

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
    private contextMenu: ContextMenu;
    private menuVisible: boolean;
    private renderedMenu: HTMLElement;

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
            const options = [
                {
                    class: 'js-playlist-create',
                    dataId: null,
                    value: 'Add to the new playlist',
                },
            ];
            this.contextMenu = new ContextMenu({
                options: options.concat(
                    this.userPlaylists
                        .filter((playlist) => {
                            return playlist.getProps().is_own;
                        })
                        .map((playlist) => {
                            return {
                                class: `js-playlist-track-add`,
                                dataId: playlist.getProps().id,
                                value: playlist.getProps().title,
                            };
                        })
                ),
            });
            this.isLoaded = true;
            this.render();
        });
    }

    addListeners() {
        window.addEventListener('click', hideContextMenu.bind(this));
        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.addEventListener('click', showContextMenu.bind(this));
            });

        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.addEventListener(
            'click',
            createNewPlaylist.bind(this)
        );

        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.addEventListener('click', addTrackToPlaylist.bind(this));
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
                    showContextMenu.bind(this)
                );
            });
        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.removeEventListener(
            'click',
            createNewPlaylist.bind(this)
        );
        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.removeEventListener('click', addTrackToPlaylist.bind(this));
        });

        window.removeEventListener('click', hideContextMenu.bind(this));

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
        this.renderedMenu = document.querySelector('.menu');
        this.menuVisible = false;
        this.addListeners();

        player.setup(document.querySelectorAll('.track-list-item'));
    }
}

export default new AlbumView();
