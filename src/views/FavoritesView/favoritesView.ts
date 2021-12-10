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

// TODO для рефактора:
// TODO Props'ы - нужны ли они, также как и authenticated в них и в ctor'е
// TODO this.isLoaded - тоже мб не нужен

export class FavoritesView extends View<never> {
    private userPlaylists: Array<PlaylistModel>;

    addListeners() {
        TrackComponent.addToggleFavorListeners();

        // TODO повторяющийся код для добавления обработчиков добавления в плейлист - вынести
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
        // TODO повторяющийся код для добавления обработчиков вызова контекстного меню - вынести
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
        // TODO повторяющийся код для обработки ошибки загрузки изображений - вынести
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        TrackComponent.removeToggleFavorListeners();

        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
        // TODO удалять обработчики вызова контекстного меню - будет повторяющийся код - вынести
        // TODO удалять обработчики добавления в плейлист - будет повторяющийся код - вынести
    }

    render(): void {
        // TODO повторяющийся код для проверки авторизации - мб тоже вынести
        if (!store.get('authenticated')) {
            router.go(routerStore.signin);
            return;
        }

        // TODO повторяющийся код для рендера вьюх - вынести
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
                    player.addHandlers();
                    TopbarComponent.addHandlers();
                }

                // TODO в некоторых вьюхах кнопка удаления из текущего плейлиста не удаляется
                playlistsContextMenu.deleteRemoveButton();
                document.querySelector('.js-menu-container').innerHTML =
                    playlistsContextMenu.render();

                // вот до сюда выносить

                UserModel.getFavorites().then((favoritesTracks) => {
                    document.querySelector('.main-layout__content').innerHTML =
                        FavoritesViewTemplate({
                            trackList: new TrackList({
                                title: 'Tracks',
                                tracks: favoritesTracks,
                            }).render(),
                        });
                    player.setup(document.querySelectorAll('.track'));
                    this.addListeners();
                });
            });
    }

    // TODO мб не нужон, тогда надо будет выпилить из базового класса
    didMount(): void {
        console.log('not implemented');
    }
}

export default new FavoritesView();
