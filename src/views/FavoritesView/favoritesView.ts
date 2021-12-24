import { View } from 'views/View/view';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import store from 'services/store/store';
import { disableBrokenImg } from 'views/utils';
import { TrackList } from 'lostpointer-uikit';
import { UserModel } from 'models/user';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { TrackComponent } from 'components/TrackComponent/track';
import baseView from 'views/BaseView/baseView';
import sidebar from 'components/Sidebar/sidebar';
import { TrackModel } from 'models/track';

import FavoritesViewTemplate from './favoritesView.hbs';
import './favoritesView.scss';

export class FavoritesView extends View<never> {
    private userPlaylists: Array<PlaylistModel>;
    private tracks: Array<TrackModel>;

    addListeners() {
        TrackComponent.addToggleFavorListeners();

        document
            .querySelectorAll('.js-playlist-track-add')
            .forEach((button) => {
                button.addEventListener(
                    'click',
                    playlistsContextMenu.addTrackToPlaylist.bind(
                        playlistsContextMenu
                    )
                );
            });
        document
            .querySelector('.js-playlist-create')
            .addEventListener(
                'click',
                playlistsContextMenu.createNewPlaylist.bind(
                    playlistsContextMenu
                )
            );

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
        //
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        sidebar.updateFavLink(false);
        TrackComponent.removeToggleFavorListeners();

        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
    }

    render(): void {
        if (!store.get('authenticated')) {
            router.go(routerStore.signin);
            return;
        }

        PlaylistModel.getUserPlaylists()
            .then((playlists) => {
                this.userPlaylists = playlists;
            })
            .then(() => {
                playlistsContextMenu.deleteRemoveButton();
                playlistsContextMenu.updatePlaylists(this.userPlaylists);
                baseView.render();
                sidebar.updateFavLink(true);

                UserModel.getFavorites().then((favoritesTracks) => {
                    this.tracks = favoritesTracks;
                    document.querySelector('.main-layout__content').innerHTML =
                        FavoritesViewTemplate({
                            trackList: new TrackList<TrackModel>({
                                title: 'Tracks',
                                tracks: favoritesTracks.map((track) =>
                                    track.getProps()
                                ),
                            }).render(),
                        });
                    this.addListeners();
                });
            });
    }

    getTracksContext(): TrackModel[] {
        return this.tracks;
    }
}

export default new FavoritesView();
