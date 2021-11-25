import { Sidebar } from 'components/Sidebar/sidebar';
import { TopAlbums } from 'components/TopAlbums/topalbums';
import TopbarComponent from 'components/Topbar/topbar';
import { FriendActivity } from 'components/FriendActivity/friendactivity';
import { SuggestedArtists } from 'components/SuggestedArtists/suggestedartists';
import { TrackList } from 'components/TrackList/tracklist';
import { SuggestedPlaylists } from 'components/SuggestedPlaylists/suggestedplaylists';
import player from 'components/Player/player';
import { TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';
import { View } from 'views/View/view';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import {
    addTrackToPlaylist,
    createNewPlaylist,
    disableBrokenImg,
    hideContextMenu,
    showContextMenu,
} from 'views/utils';

import store from 'services/store/store';

import IndexTemplate from './indexView.hbs';
import './indexView.scss';
import { PlaylistModel } from 'models/playlist';
import { ContextMenu } from 'components/ContextMenu/contextMenu';

interface IIndexViewProps {
    authenticated: boolean;
}

class IndexView extends View<IIndexViewProps> {
    private authenticated: boolean;

    private top_albums: AlbumModel[];
    private suggested_artists: ArtistModel[];
    private track_list: TrackModel[];
    private suggested_playlists: PlaylistModel[];
    private sidebar: Sidebar;
    private friend_activity: FriendActivity;
    private userAvatar: string;
    private contextMenu: string;
    private userPlaylists: Array<PlaylistModel>;
    private menuVisible: boolean;
    private renderedMenu: HTMLElement;
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
                this.suggested_playlists = new SuggestedPlaylists({
                    playlists: this.suggested_playlists,
                }).render();
                this.sidebar = new Sidebar().render();

                this.top_albums = new TopAlbums({
                    albums: this.top_albums,
                }).render();
                this.suggested_artists = new SuggestedArtists({
                    artists: this.suggested_artists,
                    extraRounded: true,
                }).render();

                this.friend_activity = new FriendActivity({
                    friends: [
                        {
                            img: 'default_avatar_150px',
                            nickname: 'Frank Sinatra',
                            listening_to: 'Strangers in the Night',
                        },
                        {
                            img: 'default_avatar_150px',
                            nickname: 'Земфира',
                            listening_to: 'Трафик',
                        },
                    ],
                }).render();
                this.contextMenu = new ContextMenu({
                    options: [
                        {
                            class: 'js-playlist-create',
                            dataId: null,
                            value: 'Add to the new playlist',
                        },
                    ].concat(
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
                }).render();
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

        PlaylistModel.createPlaylist('New playlist').then(({ id }) => {
            router.go(`${routerStore.playlist}/${id}`);
        });
    }

    addListeners() {
        const createPlaylistBtn = document.querySelector(
            '.pl-link[href="/playlist/0"]'
        );
        createPlaylistBtn.addEventListener(
            'click',
            this.createPlaylist.bind(this)
        );
        const createPlaylistContextMenuBtn = document.querySelector(
            '.js-playlist-create'
        );
        createPlaylistContextMenuBtn.addEventListener(
            'click',
            createNewPlaylist.bind(this)
        );
        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.addEventListener('click', addTrackToPlaylist.bind(this));
        });

        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.addEventListener('click', showContextMenu.bind(this));
            });
        window.addEventListener('click', hideContextMenu.bind(this));

        player.setup(document.querySelectorAll('.track-list-item'));

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
                    showContextMenu.bind(this)
                );
            });
        window.removeEventListener('click', hideContextMenu.bind(this));
        const createPlaylistBtn = document.querySelector(
            '.pl-link[href="/playlist/0"]'
        );
        createPlaylistBtn.removeEventListener(
            'click',
            this.createPlaylist.bind(this)
        );

        const createPlaylistContextMenuBtn = document.querySelector(
            '.js-playlist-create'
        );
        createPlaylistContextMenuBtn.removeEventListener(
            'click',
            createNewPlaylist.bind(this)
        );
        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.removeEventListener('click', addTrackToPlaylist.bind(this));
        });

        this.isLoaded = false;
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
            sidebar: this.sidebar,
            friend_activity: this.friend_activity,
            top_albums: this.top_albums,
            suggested_artists: this.suggested_artists,
            track_list: this.track_list,
            suggested_playlists: this.suggested_playlists,
            player: player.render(),
            contextMenu: this.contextMenu,
        });
        TopbarComponent.addHandlers();
        TopbarComponent.didMount();
        this.renderedMenu = document.querySelector('.menu');
        this.menuVisible = false;

        this.addListeners();
    }
}

export default new IndexView();
