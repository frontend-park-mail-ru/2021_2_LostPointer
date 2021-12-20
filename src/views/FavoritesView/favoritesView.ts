import { View } from 'views/View/view';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import IndexTemplate from 'views/IndexView/indexView.hbs';
import TopbarComponent from 'components/Topbar/topbar';
import store from 'services/store/store';
import sidebar from 'components/Sidebar/sidebar';
import player from 'components/Player/player';
import mobile from 'components/Mobile/mobile';
import { disableBrokenImg } from 'views/utils';
import { TrackList } from 'components/TrackList/tracklist';
import { UserModel } from 'models/user';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { TrackComponent } from 'components/TrackComponent/track';

import FavoritesViewTemplate from './favoritesView.hbs';
import './favoritesView.scss';

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
                playlistsContextMenu.updatePlaylists(this.userPlaylists);
                const app = document.getElementById('app');
                if (app.innerHTML == '') {
                    document.getElementById('app').innerHTML = IndexTemplate({
                        topbar: TopbarComponent.set({
                            authenticated: store.get('authenticated'),
                            avatar: store.get('userAvatar'),
                            offline: !navigator.onLine,
                        }).render(),
                        sidebar: sidebar.render(),
                        player: player.render(),
                        contextMenu: playlistsContextMenu.render(),
                        mobile: mobile.set(player.getNowPlaying()).render(),
                    });
                    player.setEventListeners();
                    TopbarComponent.addHandlers();
                }

                playlistsContextMenu.deleteRemoveButton();
                document.querySelector('.js-menu-container').innerHTML =
                    playlistsContextMenu.render();

                UserModel.getFavorites().then((favoritesTracks) => {
                    document.querySelector('.main-layout__content').innerHTML =
                        FavoritesViewTemplate({
                            trackList: new TrackList({
                                title: 'Tracks',
                                tracks: favoritesTracks,
                            }).render(),
                        });
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
