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
import { disableBrokenImg } from 'views/utils';

import store from 'services/store/store';

import IndexTemplate from './indexView.hbs';
import './indexView.scss';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu, { PlaylistsContextMenu } from 'components/PlaylistsContextMenu/playlistsContextMenu';

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
    private contextMenu: PlaylistsContextMenu;
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
                this.contextMenu = playlistsContextMenu;
                this.contextMenu.updatePlaylists(this.userPlaylists);
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

        const newPlaylistName = this.userPlaylists.reduce((newPlaylistName, _, index, array) => {
            if (array.find((playlist) => {
                return playlist.getProps().title == newPlaylistName;
            })) {
                return 'New playlist ' + (index + 2).toString();
            } else {
                return newPlaylistName;
            }
        }, 'New playlist')

        PlaylistModel.createPlaylist(newPlaylistName).then(({ id }) => {
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
            this.contextMenu.createNewPlaylist.bind(this.contextMenu)
        );
        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.addEventListener('click', this.contextMenu.addTrackToPlaylist.bind(this.contextMenu));
        });

        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.addEventListener('click', this.contextMenu.showContextMenu.bind(this.contextMenu));
            });
        window.addEventListener('click', this.contextMenu.hideContextMenu.bind(this.contextMenu));

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
                    this.contextMenu.showContextMenu.bind(this.contextMenu)
                );
            });
        window.removeEventListener('click', this.contextMenu.hideContextMenu.bind(this.contextMenu));
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
            this.contextMenu.createNewPlaylist.bind(this.contextMenu)
        );
        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.removeEventListener('click', this.contextMenu.addTrackToPlaylist.bind(this.contextMenu));
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
            contextMenu: this.contextMenu.render(),
        });
        TopbarComponent.addHandlers();
        TopbarComponent.didMount();

        this.addListeners();
    }
}

export default new IndexView();
