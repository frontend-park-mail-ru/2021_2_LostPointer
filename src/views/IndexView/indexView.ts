import { Sidebar } from 'components/Sidebar/sidebar';
import { TopAlbums } from 'components/TopAlbums/topalbums';
import Request from 'services/request/request';
import TopbarComponent from 'components/Topbar/topbar';
import { FriendActivity } from 'components/FriendActivity/friendactivity';
import { SuggestedArtists } from 'components/SuggestedArtists/suggestedartists';
import { TrackList } from 'components/TrackList/tracklist';
import { SuggestedPlaylists } from 'components/SuggestedPlaylists/suggestedplaylists';
import player from 'components/Player/player';
import { TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';
import routerStore from 'services/router/routerStore';
import router from 'services/router/router';
import { View } from 'views/View/view';
import {
    addTrackToPlaylist,
    createNewPlaylist,
    disableBrokenImg, hideContextMenu,
    removeTrackFromPlaylist,
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

export class IndexView extends View<IIndexViewProps> {
    private authenticated: boolean;
    private playButtonHandler: (e) => void;

    private top_albums: AlbumModel[];
    private suggested_artists: ArtistModel[];
    private track_list: TrackModel[];
    private suggested_playlists: PlaylistModel[];
    private sidebar: Sidebar;
    private friend_activity: FriendActivity;
    private userAvatar: string;
    private contextMenu: ContextMenu;
    private userPlaylists: Array<PlaylistModel>;
    private selectedTrackId: number;
    private menuVisible: boolean;
    private renderedMenu: HTMLElement;

    constructor(props?: IIndexViewProps) {
        super(props);
        this.isLoaded = false;
    }

    didMount() {
        this.authenticated = store.get('authenticated');
        this.userAvatar = store.get('userAvatar');

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
        })

        const userPlaylists = PlaylistModel.getUserPlaylists().then((playlists) => {
            this.userPlaylists = playlists;
        });

        Promise.all([tracks, artists, albums, playlists, userPlaylists]).then(() => {
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
                ].concat(this.userPlaylists.map((playlist) => {
                    return {
                        class: `js-playlist-track-add`,
                        dataId: playlist.getProps().id,
                        value: playlist.getProps().title,
                    }
                })),
            });
            this.isLoaded = true;
            this.render();
        });
    }

    createPlaylist(event) {
        event.preventDefault();
        event.stopPropagation();

        const formdata = new FormData();
        formdata.append('title', 'New playlist');

        PlaylistModel.createPlaylist(formdata)
            .then(({id}) => {
                router.go(`${routerStore.playlist}/${id}`);
            });
    }

    addListeners() {
        if (this.authenticated) {
            document
                .querySelector('.js-logout')
                .addEventListener('click', this.userLogout);
        }

        const createPlaylistBtn = document.querySelector('.pl-link[href="/playlist/0"]');
        createPlaylistBtn.addEventListener('click', this.createPlaylist.bind(this));
        const createPlaylistContextMenuBtn = document.querySelector('.js-playlist-create');
        createPlaylistContextMenuBtn.addEventListener('click', createNewPlaylist.bind(this))
        const addTrackToPlaylistBtns = document.querySelectorAll('.js-playlist-track-add');
        addTrackToPlaylistBtns.forEach((button) => {
            button.addEventListener('click', addTrackToPlaylist.bind(this));
        });

        document.querySelectorAll('.track-list-item-playlist').forEach((element) => {
            element.addEventListener('click', showContextMenu.bind(this));
        })
        window.addEventListener('click', hideContextMenu.bind(this));

        this.playButtonHandler = (e) => {
            if (e.target.className === 'track-list-item-play') {
                if (!this.authenticated) {
                    router.go(routerStore.signin);
                    return;
                }
                if (e.target === player.nowPlaying) {
                    // Ставим на паузу/продолжаем воспр.
                    player.toggle();
                    return;
                }
                if (player.nowPlaying) {
                    // Переключили на другой трек
                    player.nowPlaying.dataset.playing = 'false';
                    player.nowPlaying.src = '/static/img/play-outline.svg';
                }

                player.setPos(parseInt(e.target.dataset.pos, 10), e.target);

                e.target.dataset.playing = 'true';
                player.setTrack({
                    url: `/static/tracks/${e.target.dataset.url}`,
                    cover: `/static/artworks/${e.target.dataset.cover}`,
                    title: e.target.dataset.title,
                    artist: e.target.dataset.artist,
                    album: e.target.dataset.album,
                });
            }
        };
        player.setup(document.querySelectorAll('.track-list-item'));
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
        document
            .querySelectorAll('.track-list-item-play')
            .forEach((e) =>
                e.removeEventListener('click', this.playButtonHandler)
            );

        document.querySelectorAll('.track-list-item-playlist').forEach((element) => {
            element.removeEventListener('click', showContextMenu.bind(this));
        })
        window.removeEventListener('click', hideContextMenu.bind(this));

        const createPlaylistBtn = document.querySelector('.pl-link[href="/playlist/0"]');
        createPlaylistBtn.removeEventListener('click', this.createPlaylist.bind(this));

        const createPlaylistContextMenuBtn = document.querySelector('.js-playlist-create');
        createPlaylistContextMenuBtn.removeEventListener('click', createNewPlaylist.bind(this))
        const addTrackToPlaylistBtns = document.querySelectorAll('.js-playlist-track-add');
        addTrackToPlaylistBtns.forEach((button) => {
            button.removeEventListener('click', addTrackToPlaylist.bind(this));
        });

        const suggestedTracksContainer = document.querySelector(
            '.suggested-tracks-container'
        );
        if (suggestedTracksContainer)
            suggestedTracksContainer.removeEventListener(
                'click',
                this.playButtonHandler
            );
        this.isLoaded = false;
        player.unmount();
    }

    userLogout() {
        Request.post('/user/logout').then(() => {
            player.stop();
            player.clear();
            store.set('authenticated', false);
            this.authenticated = false;
            window.localStorage.removeItem('lastPlayedData');
            TopbarComponent.logout();
        });
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = IndexTemplate({
            topbar: TopbarComponent.set({
                authenticated: this.authenticated,
                avatar: this.userAvatar,
                offline: navigator.onLine !== true,
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
        this.renderedMenu = document.querySelector('.menu');
        this.menuVisible = false;

        this.addListeners();
    }
}

export default new IndexView();
