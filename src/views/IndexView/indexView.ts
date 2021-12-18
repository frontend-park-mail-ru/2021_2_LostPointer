import sidebar from 'components/Sidebar/sidebar';
import { TopAlbums } from 'components/TopAlbums/topalbums';
import TopbarComponent from 'components/Topbar/topbar';
import { SuggestedArtists } from 'components/SuggestedArtists/suggestedartists';
import { TrackList } from 'components/TrackList/tracklist';
import suggestedPlaylists from 'components/SuggestedPlaylists/suggestedplaylists';
import player from 'components/Player/player';
import { TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';
import { View } from 'views/View/view';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { disableBrokenImg } from 'views/utils';
import store from 'services/store/store';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import mobile from 'components/Mobile/mobile';

import IndexTemplate from './indexView.hbs';
import './indexView.scss';
import { TrackComponent } from 'components/TrackComponent/track';

interface IIndexViewProps {
    authenticated: boolean;
}

class IndexView extends View<IIndexViewProps> {
    private top_albums: AlbumModel[];
    private suggested_artists: ArtistModel[];
    private track_list: TrackModel[];
    private suggested_playlists: PlaylistModel[];
    private userAvatar: string;
    private userPlaylists: Array<PlaylistModel>;
    private renderCount: number;

    constructor(props?: IIndexViewProps) {
        super(props);
        this.isLoaded = false;
        this.renderCount = 0;
    }

    didMount() {
        const tracks = TrackModel.getHomepageTracks().then((tracks) => {
            this.track_list = tracks;
        });
        const artists = ArtistModel.getHomepageArtists().then((artists) => {
            this.suggested_artists = artists;
        });
        const albums = AlbumModel.getHomepageAlbums().then((albums) => {
            this.top_albums = albums;
        });
        const playlists = PlaylistModel.getUserPlaylists().then((playlists) => {
            this.suggested_playlists = playlists;
        });

        const userPlaylists = PlaylistModel.getUserPlaylists().then(
            (playlists) => {
                this.userPlaylists = playlists;
            }
        );

        Promise.all([tracks, artists, albums, playlists, userPlaylists]).then(
            () => {
                this.track_list = new TrackList({
                    title: 'Tracks of the Week',
                    tracks: this.track_list,
                }).render();

                suggestedPlaylists.set(this.suggested_playlists);

                this.top_albums = new TopAlbums({
                    albums: this.top_albums,
                }).render();
                this.suggested_artists = new SuggestedArtists({
                    artists: this.suggested_artists,
                    extraRounded: true,
                }).render();

                playlistsContextMenu.updatePlaylists(this.userPlaylists);
                this.isLoaded = true;
                this.render();
            }
        );
    }

    createPlaylist(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!store.get('authenticated')) {
            router.go(routerStore.signin);
            return;
        }

        const newPlaylistName = this.userPlaylists
            .filter((playlist) => {
                return playlist.getProps().is_own;
            })
            .reduce((newPlaylistName, _, index, array) => {
                if (
                    array.find((playlist) => {
                        return playlist.getProps().title == newPlaylistName;
                    })
                ) {
                    return 'New playlist ' + (index + 2).toString();
                } else {
                    return newPlaylistName;
                }
            }, 'New playlist');

        PlaylistModel.createPlaylist(newPlaylistName).then(({ id }) => {
            router.go(`${routerStore.playlist}/${id}`);
        });
    }

    showPublicPlaylists() {
        if (!suggestedPlaylists.publicView()) {
            const createPlaylistBtn = document.querySelector(
                '.pl-link[href="/playlist/0"]'
            );
            createPlaylistBtn.removeEventListener(
                'click',
                this.createPlaylist.bind(this)
            );
            suggestedPlaylists.toggleView(this.suggested_playlists, true);
        }
    }

    showOwnPlaylists() {
        if (suggestedPlaylists.publicView()) {
            suggestedPlaylists.toggleView(this.suggested_playlists, false);
            const createPlaylistBtn = document.querySelector(
                '.pl-link[href="/playlist/0"]'
            );
            createPlaylistBtn.addEventListener(
                'click',
                this.createPlaylist.bind(this)
            );
        }
    }

    addListeners() {
        if (store.get('authenticated')) {
            TrackComponent.addToggleFavorListeners();
        }
        if (!suggestedPlaylists.publicView()) {
            const createPlaylistBtn = document.querySelector(
                '.pl-link[href="/playlist/0"]'
            );
            if (createPlaylistBtn) {
                createPlaylistBtn.addEventListener(
                    'click',
                    this.createPlaylist.bind(this)
                );
            }
        }

        const publicPlaylistsBtn = document.querySelector(
            '.js_public_playlists'
        );
        publicPlaylistsBtn.addEventListener(
            'click',
            this.showPublicPlaylists.bind(this)
        );
        const ownPlaylistsBtn = document.querySelector('.js_own_playlists');
        ownPlaylistsBtn.addEventListener(
            'click',
            this.showOwnPlaylists.bind(this)
        );

        const createPlaylistContextMenuBtn = document.querySelector(
            '.js-playlist-create'
        );
        createPlaylistContextMenuBtn.addEventListener(
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

        player.setup(document.querySelectorAll('.track')); //TODO=Вынести в сам плеер, при определении новой View выполнять
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
        this.isLoaded = false;
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
        const createPlaylistBtn = document.querySelector(
            '.pl-link[href="/playlist/0"]'
        );
        if (createPlaylistBtn) {
            createPlaylistBtn.removeEventListener(
                'click',
                this.createPlaylist.bind(this)
            );
        }

        const publicPlaylistsBtn = document.querySelector(
            '.js_public_playlists'
        );
        if (publicPlaylistsBtn) {
            publicPlaylistsBtn.removeEventListener(
                'click',
                this.showPublicPlaylists.bind(this)
            );
        }
        const ownPlaylistsBtn = document.querySelector('.js_own_playlists');
        if (ownPlaylistsBtn) {
            ownPlaylistsBtn.removeEventListener(
                'click',
                this.showOwnPlaylists.bind(this)
            );
        }

        const createPlaylistContextMenuBtn = document.querySelector(
            '.js-playlist-create'
        );
        if (createPlaylistContextMenuBtn) {
            createPlaylistContextMenuBtn.removeEventListener(
                'click',
                playlistsContextMenu.createNewPlaylist.bind(
                    playlistsContextMenu
                )
            );
        }
        document.querySelectorAll(
            '.js-playlist-track-add'
        ).forEach((button) => {
            button.removeEventListener(
                'click',
                playlistsContextMenu.addTrackToPlaylist.bind(
                    playlistsContextMenu
                )
            );
        });

        if (store.get('authenticated')) {
            TrackComponent.removeToggleFavorListeners();
        }
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = IndexTemplate({
            topbar: TopbarComponent.set({
                authenticated: store.get('authenticated'),
                avatar: store.get('userAvatar'),
                offline: !navigator.onLine,
            }).render(),
            sidebar: sidebar.render(),
            top_albums: this.top_albums,
            suggested_artists: this.suggested_artists,
            track_list: this.track_list,
            suggested_playlists: suggestedPlaylists.render(),
            player: player.render(),
            contextMenu: playlistsContextMenu.render(),
            mobile: mobile.set(player.getNowPlaying()).render(),
        });
        TopbarComponent.addHandlers();
        TopbarComponent.didMount();

        player.addHandlers();
        this.addListeners();
    }
}

export default new IndexView();
