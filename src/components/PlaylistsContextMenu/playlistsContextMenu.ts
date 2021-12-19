import { Component } from 'components/Component/component';

import ContextMenuTemplate from './playlistsContextMenu.hbs';
import './playlistsContextMenu.scss';
import { PlaylistModel } from 'models/playlist';
import store from 'services/store/store';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { IResponseBody } from 'services/request/request';

interface IContextMenuOption {
    class: string;
    dataId: number;
    value: string;
}

interface IContextMenuProps {
    options: Array<IContextMenuOption>;
    deleteButtonIsHere: boolean;
}

export class PlaylistsContextMenu extends Component<IContextMenuProps> {
    isVisible: boolean;
    selectedTrackId: number;
    playlists: Array<PlaylistModel>;

    constructor() {
        super();
        this.isVisible = false;
        this.props.deleteButtonIsHere = false;
    }

    addRemoveButton() {
        this.props.deleteButtonIsHere = true;
    }

    deleteRemoveButton() {
        this.props.deleteButtonIsHere = false;
    }

    updatePlaylists(playlists: Array<PlaylistModel>) {
        this.selectedTrackId = null;
        this.isVisible = false;
        this.playlists = playlists;
        this.props.options = this.playlists
            .filter((playlist) => {
                return playlist.getProps().is_own;
            })
            .map((playlist) => {
                return {
                    class: `js-playlist-track-add`,
                    dataId: playlist.getProps().id,
                    value: playlist.getProps().title,
                };
            });
    }

    render(): string {
        return ContextMenuTemplate(this.props);
    }

    toggleMenu(command) {
        const renderedMenu = document.querySelector('.menu');

        (<HTMLElement>renderedMenu).style.visibility =
            command === 'show' ? 'visible' : 'hidden';
        (<HTMLElement>renderedMenu).style.opacity =
            command === 'show' ? '1' : '0';
        this.isVisible = command === 'show';
    }

    hideContextMenu() {
        if (!store.get('authenticated')) {
            return;
        }
        if (this.isVisible) {
            this.toggleMenu('hide');
        }
    }

    showContextMenu(event) {
        if (!store.get('authenticated')) {
            router.go(routerStore.signin);
            return;
        }
        const renderedMenu = document.querySelector('.menu');
        this.selectedTrackId = parseInt(event.target.getAttribute('data-id'));
        const rect = event.target.getBoundingClientRect();
        (<HTMLElement>renderedMenu).style.left = `${rect.left + 10}px`;
        (<HTMLElement>renderedMenu).style.top = `${rect.top + 10}px`;
        this.toggleMenu('show');
        event.stopPropagation();
    }

    addTrackToPlaylist(event) {
        const playlistId = parseInt(event.target.getAttribute('data-id'));
        PlaylistModel.addTrack(playlistId, this.selectedTrackId);
    }

    createNewPlaylist() {
        const newPlaylistName = this.playlists
            .filter((playlist) => {
                return playlist.getProps().is_own;
            })
            .reduce((newPlaylistName, _, index, array) => {
                if (
                    array.find((playlist) => {
                        return playlist.getProps().title == newPlaylistName;
                    })
                ) {
                    return 'New playlist ' + (index + 2).toString();
                } else {
                    return newPlaylistName;
                }
            }, 'New playlist');

        PlaylistModel.createPlaylist(newPlaylistName).then(({ id }) => {
            PlaylistModel.addTrack(id, this.selectedTrackId).then(
                (response) => {
                    if (response.status === 201) {
                        router.go(`${routerStore.playlist}/${id}`);
                    }
                }
            );
        });
    }

    removeTrackFromPlaylist(playlist): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            PlaylistModel.removeTrack(
                playlist.getProps().id,
                this.selectedTrackId
            ).then((response) => {
                if (response.status === 200) {
                    playlist.getProps().tracks.splice(
                        playlist.getProps().tracks.findIndex((track) => {
                            return track.getProps().id === this.selectedTrackId;
                        }),
                        1
                    );
                }
                res(response);
            });
        });
    }
}

export default new PlaylistsContextMenu();
