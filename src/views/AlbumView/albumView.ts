import { View } from 'views/View/view';
import { AlbumModel } from 'models/album';
import { TrackList } from 'components/TrackList/tracklist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { disableBrokenImg } from 'views/utils';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import baseView from 'views/BaseView/baseView';
import { TrackModel } from 'models/track';

import AlbumTemplate from './albumView.hbs';
import './albumView.scss';

export class AlbumView extends View<never> {
    private album: AlbumModel;
    private trackList: TrackList;
    private userPlaylists: Array<PlaylistModel>;
    private tracks: Array<TrackModel>;
    private albumID: string;

    addListeners() {
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

        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        return;
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
            baseView.render();
            playlistsContextMenu.deleteRemoveButton();
            document.querySelector('.js-menu-container').innerHTML =
                playlistsContextMenu.render();
            document.querySelector('.main-layout__content').innerHTML =
                AlbumTemplate({
                    artWork:
                        '/static/artworks/' +
                        this.album.getProps().artwork +
                        '_512px.webp',
                    title: this.album.getProps().title,
                    trackList: this.trackList,
                    contextMenu: playlistsContextMenu.render(),
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
