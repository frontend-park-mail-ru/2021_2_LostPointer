import { View } from 'views/View/view';
import { SuggestedAlbums } from 'components/SugestedAlbums/suggestedAlbums';
import { TrackList } from 'components/TrackList/tracklist';
import { ArtistModel } from 'models/artist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { disableBrokenImg } from 'views/utils';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import { PlaylistModel } from 'models/playlist';
import { TrackModel } from 'models/track';
import baseView from 'views/BaseView/baseView';

import ArtistTemplate from './artistView.hbs';
import './artistView.scss';

export class ArtistView extends View<never> {
    private artist: ArtistModel;
    private trackList: TrackList;
    private albumList: SuggestedAlbums;
    private userPlaylists: Array<PlaylistModel>;
    private tracks: TrackModel[];

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
        return;
    }

    render() {
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
            this.tracks = tracks;
            this.trackList = new TrackList({
                title: 'Tracks',
                tracks: tracks,
            }).render();
            playlistsContextMenu.updatePlaylists(this.userPlaylists);
            baseView.render();
            playlistsContextMenu.deleteRemoveButton();
            document.querySelector('.js-menu-container').innerHTML =
                playlistsContextMenu.render();
            document.getElementById('content').innerHTML = ArtistTemplate({
                name: this.artist.getProps().name,
                video: this.artist.getProps().video,
                artistAvatar: this.artist.getProps().avatar,
                albumList: this.albumList,
                trackList: this.trackList,
            });
            this.addListeners();
        });
    }

    getTracksContext(): TrackModel[] {
        return this.tracks;
    }
}

export default new ArtistView();
