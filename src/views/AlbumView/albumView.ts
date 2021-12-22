import { View } from 'views/View/view';
import { AlbumModel } from 'models/album';
import { TrackList } from 'components/TrackList/tracklist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import {
    addDisableBrokenImgListeners,
    removeDisableBrokenImgListeners,
} from 'views/utils';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';

import AlbumTemplate from './albumView.hbs';
import './albumView.scss';
import { TrackModel } from 'models/track';
import baseView from 'views/BaseView/baseView';
import { TrackComponent } from 'components/TrackComponent/track';
import store from 'services/store/store';
import './albumView.scss';

export class AlbumView extends View<never> {
    private album: AlbumModel;
    private trackList: TrackList;
    private userPlaylists: Array<PlaylistModel>;
    private tracks: Array<TrackModel>;
    private albumID: string;

    addListeners() {
        if (store.get('authenticated')) {
            TrackComponent.addToggleFavorListeners();
        }
        playlistsContextMenu.addListeners();
        addDisableBrokenImgListeners();
    }

    unmount() {
        removeDisableBrokenImgListeners();
        playlistsContextMenu.removeListeners();
        if (store.get('authenticated')) {
            TrackComponent.removeToggleFavorListeners();
        }
    }

    render() {
        const regex = /^\/album\/(\d+)$/gm;
        const match = regex.exec(window.location.pathname);
        if (!match) {
            router.go(routerStore.dashboard);
        }
        const albumId = match[1];
        this.albumID = albumId;
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
            const props = this.album.getProps();
            this.tracks = props.tracks;
            this.trackList = new TrackList({
                title: 'Tracks',
                tracks: props.tracks,
            }).render();

            playlistsContextMenu.updatePlaylists(this.userPlaylists);
            playlistsContextMenu.deleteRemoveButton();
            baseView.render();

            document.querySelector('.main-layout__content').innerHTML =
                AlbumTemplate({
                    artWork:
                        '/static/artworks/' +
                        this.album.getProps().artwork +
                        '_512px.webp',
                    title: this.album.getProps().title,
                    trackList: this.trackList,
                    tracksCount: this.album.getProps().tracks_count,
                    tracksDurationMin: Math.floor(
                        this.album.getProps().tracks_duration / 60
                    ),
                    tracksDurationSec: Math.floor(
                        this.album.getProps().tracks_duration % 60
                    ),
                    album: this.album.getProps(),
                });

            this.addListeners();
        });
    }

    getTracksContext(): TrackModel[] {
        return this.tracks;
    }
}

export default new AlbumView();
