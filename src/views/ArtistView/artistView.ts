import { View } from 'views/View/view';
import { SuggestedAlbums, TrackList } from 'lostpointer-uikit';
import { ArtistModel } from 'models/artist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import {
    addDisableBrokenImgListeners,
    removeDisableBrokenImgListeners,
    scrollUp,
} from 'views/utils';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import { PlaylistModel } from 'models/playlist';
import { TrackModel } from 'models/track';
import baseView from 'views/BaseView/baseView';
import store from 'services/store/store';
import { TrackComponent } from 'components/TrackComponent/track';

import ArtistTemplate from './artistView.hbs';
import './artistView.scss';

export class ArtistView extends View<never> {
    private artist: ArtistModel;
    private trackList: TrackList;
    private albumList: SuggestedAlbums;
    private userPlaylists: Array<PlaylistModel>;
    private tracks: TrackModel[];

    addListeners() {
        if (store.get('authenticated')) {
            TrackComponent.addToggleFavorListeners();
        }
        const video = document.querySelector('.artist__background-video');
        if (video) {
            video.addEventListener('ended', () => {
                video.classList.add('transition');
            });
        }

        playlistsContextMenu.addListeners();
        addDisableBrokenImgListeners();
    }

    unmount() {
        removeDisableBrokenImgListeners();
        playlistsContextMenu.removeListeners();

        const video = document.querySelector('.artist__background-video');
        if (video) {
            video.removeEventListener('ended', () => {
                video.classList.add('transition');
            });
        }

        if (store.get('authenticated')) {
            TrackComponent.removeToggleFavorListeners();
        }
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
                //TODO=??????????????????!!!
                return track;
            });
            this.tracks = tracks;
            this.trackList = new TrackList<TrackModel>({
                title: 'Tracks',
                tracks: tracks.map((track) => track.getProps()),
            }).render();

            playlistsContextMenu.updatePlaylists(this.userPlaylists);
            playlistsContextMenu.deleteRemoveButton();
            baseView.render();

            document.getElementById('content').innerHTML = ArtistTemplate({
                name: this.artist.getProps().name,
                video: this.artist.getProps().video,
                artistAvatar: this.artist.getProps().avatar,
                albumList: this.albumList,
                trackList: this.trackList,
            });
            this.addListeners();

            scrollUp();
        });
    }

    getTracksContext(): TrackModel[] {
        return this.tracks;
    }
}

export default new ArtistView();
