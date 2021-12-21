import { View } from 'views/View/view';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import store from 'services/store/store';
import player from 'components/Player/player';
import { disableBrokenImg } from 'views/utils';
import { TrackList } from 'components/TrackList/tracklist';
import { UserModel } from 'models/user';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { TrackComponent } from 'components/TrackComponent/track';

import FavoritesViewTemplate from './favoritesView.hbs';
import './favoritesView.scss';
import baseView from 'views/BaseView/baseView';

export class FavoritesView extends View<never> {
    private userPlaylists: Array<PlaylistModel>;

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
                UserModel.getFavorites().then((favoritesTracks) => {
                    baseView.render();
                    const content = document.getElementById('content');
                    content.innerHTML = FavoritesViewTemplate({
                        trackList: new TrackList({
                            title: 'Tracks',
                            tracks: favoritesTracks,
                        }).render(),
                    });
                    playlistsContextMenu.updatePlaylists(this.userPlaylists);

                    playlistsContextMenu.deleteRemoveButton();
                    document.querySelector('.js-menu-container').innerHTML =
                        playlistsContextMenu.render();
                    player.setup(favoritesTracks);
                    this.addListeners();
                });
            });
    }

    didMount(): void {
        console.log('not implemented');
    }
}

export default new FavoritesView();
