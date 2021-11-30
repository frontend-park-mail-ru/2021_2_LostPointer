import { View } from 'views/View/view';
import player from 'components/Player/player';
import sidebar from 'components/Sidebar/sidebar';
import TopbarComponent from 'components/Topbar/topbar';
import { SuggestedAlbums } from 'components/SugestedAlbums/suggestedAlbums';
import { TrackList } from 'components/TrackList/tracklist';
import { ArtistModel } from 'models/artist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { disableBrokenImg } from 'views/utils';
import playlistsContextMenu, { PlaylistsContextMenu } from 'components/PlaylistsContextMenu/playlistsContextMenu';
import { PlaylistModel } from 'models/playlist';

import ArtistTemplate from './artistView.hbs';
import './artistView.scss';
import store from 'services/store/store';
import mobile from 'components/Mobile/mobile';

interface IArtistViewProps {
    authenticated: boolean;
}

export class ArtistView extends View<IArtistViewProps> {
    private userAvatar: string;
    private artist: ArtistModel;
    private trackList: TrackList;
    private albumList: SuggestedAlbums;
    private contextMenu: PlaylistsContextMenu;
    private userPlaylists: Array<PlaylistModel>;

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

        const artist = ArtistModel.getArtist(artistId).then((artist) => {
            if (!artist) {
                router.go(routerStore.dashboard);
            }
            this.artist = artist;
        });

        const userPlaylists = PlaylistModel.getUserPlaylists().then(
            (playlists) => {
                this.userPlaylists = playlists;
            }
        );

        Promise.all([artist, userPlaylists]).then(() => {
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
            this.contextMenu = playlistsContextMenu;
            this.contextMenu.updatePlaylists(this.userPlaylists);
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

        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.addEventListener('click', this.contextMenu.showContextMenu.bind(this.contextMenu));
            });
        window.addEventListener('click', this.contextMenu.hideContextMenu.bind(this.contextMenu));
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
        window.removeEventListener('click', this.contextMenu.hideContextMenu.bind(this.contextMenu));

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
                avatar: store.get('userAvatar'),
                offline: navigator.onLine !== true,
            }).render(),
            sidebar: sidebar.render(),
            albumList: this.albumList,
            trackList: this.trackList,
            player: player.render(),
            contextMenu: this.contextMenu.render(),
        });
        TopbarComponent.addHandlers();
        this.addListeners();
        TopbarComponent.didMount();

        player.setup(document.querySelectorAll('.track-list-item'));
    }
}

export default new ArtistView();
