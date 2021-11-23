import { View } from 'views/View/view';
import player from 'components/Player/player';
import { Sidebar } from 'components/Sidebar/sidebar';
import TopbarComponent from 'components/Topbar/topbar';
import topbar from 'components/Topbar/topbar';
import { SuggestedAlbums } from 'components/SugestedAlbums/suggestedAlbums';
import { TrackList } from 'components/TrackList/tracklist';
import { ArtistModel } from 'models/artist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { addTrackToPlaylist, createNewPlaylist, disableBrokenImg, hideContextMenu, showContextMenu } from 'views/utils';
import { ContextMenu } from 'components/ContextMenu/contextMenu';
import { PlaylistModel } from 'models/playlist';

import ArtistTemplate from './artistView.hbs';
import './artistView.scss';
import store from 'services/store/store';

interface IArtistViewProps {
    authenticated: boolean;
}

export class ArtistView extends View<IArtistViewProps> {
    private authenticated: boolean;

    private sidebar: Sidebar;
    private topbar: Topbar;
    private userAvatar: string;
    private artist: ArtistModel;
    private trackList: TrackList;
    private albumList: SuggestedAlbums;
    private contextMenu: ContextMenu;
    private userPlaylists: Array<PlaylistModel>;
    private selectedTrackId: number;
    private menuVisible: boolean;
    private renderedMenu: HTMLElement;

    constructor(props?: IArtistViewProps) {
        super(props);
        this.isLoaded = false;
    }

    didMount() {
        const regex = /^\/artist\/(\d+)$/gm;
        const match = regex.exec(window.location.pathname);
        if (!match) {
            router.go(routerStore.dashboard);
        }
        const artistId = match[1];

        this.userAvatar = store.get('userAvatar');

        const artist = ArtistModel.getArtist(artistId).then((artist) => {
            if (!artist) {
                router.go(routerStore.dashboard);
            }
            this.artist = artist;
        });

        const userPlaylists = PlaylistModel.getUserPlaylists().then((playlists) => {
            this.userPlaylists = playlists;
        });

        Promise.all([artist, userPlaylists]).then(() => {
            this.sidebar = new Sidebar().render();
            this.albumList = new SuggestedAlbums({
                albums: this.artist.getProps().albums,
            }).render();
            const props = this.artist.getProps();
            const tracks = props.tracks.map((track) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                track.props.artist = this.artist;
                //TODO=ПОПРАВИТЬ!!!
                return track;
            });
            this.trackList = new TrackList({
                title: 'Tracks',
                tracks: tracks,
            }).render();
            this.contextMenu = new ContextMenu({
                options: [
                    {
                        class: 'js-playlist-create',
                        dataId: null,
                        value: 'Add to the new playlist',
                    },
                ].concat(this.userPlaylists.filter((playlist) => {
                    return playlist.getProps().is_own;
                })
                    .map((playlist) => {
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

    addListeners() {
        const video = document.querySelector('.artist__background-video');
        if (video) {
            video.addEventListener('ended', () => {
                video.classList.add('transition');
            });
        }

        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.addEventListener('click', createNewPlaylist.bind(this))
        const addTrackToPlaylistBtns = document.querySelectorAll('.js-playlist-track-add');
        addTrackToPlaylistBtns.forEach((button) => {
            button.addEventListener('click', addTrackToPlaylist.bind(this));
        });

        document.querySelectorAll('.track-list-item-playlist').forEach((element) => {
            element.addEventListener('click', showContextMenu.bind(this));
        })
        window.addEventListener('click', hideContextMenu.bind(this));
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
        document.querySelectorAll('.track-list-item-playlist').forEach((element) => {
            element.removeEventListener('click', showContextMenu.bind(this));
        })
        window.removeEventListener('click', hideContextMenu.bind(this));

        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.removeEventListener('click', createNewPlaylist.bind(this))
        const addTrackToPlaylistBtns = document.querySelectorAll('.js-playlist-track-add');
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

        document.getElementById('app').innerHTML = ArtistTemplate({
            name: this.artist.getProps().name,
            video: this.artist.getProps().video,
            artistAvatar: this.artist.getProps().avatar,
            topbar: TopbarComponent.set({
                authenticated: store.get('authenticated'),
                avatar: this.userAvatar,
                offline: navigator.onLine !== true,
            }).render(),
            sidebar: this.sidebar,
            albumList: this.albumList,
            trackList: this.trackList,
            player: player.render(),
            contextMenu: this.contextMenu.render(),
        });
        this.renderedMenu = document.querySelector('.menu');
        this.menuVisible = false;
        TopbarComponent.addHandlers();
        this.addListeners();
        topbar.didMount();

        player.setup(document.querySelectorAll('.track-list-item'));
    }
}

export default new ArtistView();
