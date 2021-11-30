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
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
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
            playlistsContextMenu.updatePlaylists(this.userPlaylists);
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
            contextMenu: playlistsContextMenu.render(),
            mobile: mobile.render(),
        });
        TopbarComponent.addHandlers();
        this.addListeners();
        TopbarComponent.didMount();

        player.setEventListeners();
        player.setup(document.querySelectorAll('.track'));
    }
}

export default new ArtistView();
