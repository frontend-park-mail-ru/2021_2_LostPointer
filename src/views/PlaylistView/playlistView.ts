import { View } from 'views/View/view';
import sidebar from 'components/Sidebar/sidebar';
import TopbarComponent from 'components/Topbar/topbar';
import { TrackList } from 'components/TrackList/tracklist';
import { DEFAULT_ARTWORK, PlaylistModel } from 'models/playlist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import store from 'services/store/store';
import { disableBrokenImg } from 'views/utils';
import player from 'components/Player/player';
import { InputFormComponent } from 'components/InputForm/inputform';
import playlistsContextMenu, { PlaylistsContextMenu } from 'components/PlaylistsContextMenu/playlistsContextMenu';

import PlaylistTemplate from './playlistView.hbs';
import './playlistView.scss';

// TODO! service worker (для альбома и поиска)
// TODO генерация ссылки для шеринга
// TODO аватары пользователей-создателей плейлиста
// TODO ссылки на альбомы на альбомах в треклисте
// TODO проверить все unmount
// TODO рефактор вьюх по аналогии с Search

interface IPlaylistViewProps {
    authenticated: boolean;
}

export class PlaylistView extends View<IPlaylistViewProps> {
    private userAvatar: string;
    private playlist: PlaylistModel;
    private userPlaylists: Array<PlaylistModel>;
    private trackList: TrackList;
    private inputs: Array<string>;
    private contextMenu: PlaylistsContextMenu;
    private renderedMenu: HTMLElement;

    constructor(props?: IPlaylistViewProps) {
        super(props);
        this.isLoaded = false;
    }

    didMount(): void {
        const regex = /^\/playlist\/(\d+)$/gm;
        const match = regex.exec(window.location.pathname);
        if (!match) {
            router.go(routerStore.dashboard);
        }
        const playlistId = parseInt(match[1]);

        const playlist = PlaylistModel.getPlaylist(playlistId).then(
            (playlist) => {
                if (!playlist) {
                    router.go(routerStore.dashboard);
                }
                this.playlist = playlist;
            }
        );

        const userPlaylists = PlaylistModel.getUserPlaylists().then(
            (playlists) => {
                this.userPlaylists = playlists;
            }
        );

        Promise.all([playlist, userPlaylists]).then(() => {
            const props = this.playlist.getProps();
            this.trackList = new TrackList({
                title: 'Tracks',
                tracks: props.tracks,
            });
            this.inputs = [
                new InputFormComponent({
                    class: 'editwindow__form-input',
                    name: 'title',
                    type: 'text',
                    placeholder: 'Title',
                    value: props.title,
                }).render(),
            ];
            this.contextMenu = playlistsContextMenu;
            this.contextMenu.addRemoveButton();
            this.contextMenu.updatePlaylists(this.userPlaylists);
            this.isLoaded = true;
            this.render();
        });
    }

    displayEditWindow(event) {
        if (!store.get('authenticated') || !this.playlist.getProps().is_own) {
            return;
        }
        const playlistEditWindow = document.querySelector('.editwindow');
        (<HTMLElement>playlistEditWindow).style.display = 'block';
        event.stopPropagation();
    }

    removeEditWindow(event) {
        if (!store.get('authenticated')) {
            return;
        }
        const playlistEditWindow = document.querySelector('.editwindow');

        if (event.target == playlistEditWindow) {
            (<HTMLElement>playlistEditWindow).style.display = 'none';
        }

        const msg = document.querySelector('.editwindow__form-msg');
        if (msg) {
            (<HTMLElement>msg).innerText = '';
        }
    }

    uploadAvatarFile(event) {
        event.preventDefault();

        if (!this.playlist.getProps().is_own) {
            return;
        }

        const file = event.target.files[0];
        let readFile = null;
        const msg = document.querySelector('.editwindow__form-msg');
        (<HTMLElement>msg).innerText = '';

        const ext = file.name
            .substring(file.name.lastIndexOf('.') + 1)
            .toLowerCase();
        if (
            ext === 'gif' ||
            ext === 'png' ||
            ext === 'jpeg' ||
            ext === 'jpg' ||
            ext === 'webp'
        ) {
            const reader = new FileReader();
            reader.addEventListener('load', (e) => {
                e.preventDefault();
                const avatar = document.querySelector(
                    '.editwindow__avatar-img'
                );
                if (typeof e.target.result === 'string') {
                    avatar.setAttribute('src', e.target.result);
                    (<HTMLElement>avatar).style.display = 'block';
                    readFile = e.target.result;
                }
            });
            reader.readAsDataURL(file);
        } else {
            msg.classList.remove('success');
            (<HTMLElement>msg).innerText = 'Invalid file';
            msg.classList.add('fail', 'visible');
            return;
        }

        this.playlist
            .updateInformation(
                null,
                // FIXME костыль, потому что бэк присваивает is_public значение false, если он не указан в запросе
                this.playlist.getProps().is_public ? this.playlist.getProps().is_public : null,
                file
            )
            .then((body) => {
                // при успехе ответ возвращает только artwork, без status
                if (!body.status) {
                    const avatar = document.querySelector(
                        '.playlist__description-img'
                    );
                    avatar.setAttribute('src', readFile);
                    (<HTMLElement>avatar).style.display = 'block';
                    msg.classList.remove('fail');
                    (<HTMLElement>msg).innerText = 'Changed successfully';
                    msg.classList.add('success', 'visible');

                    const deleteAvatarBtn = document.querySelector(
                        '.editwindow__avatar-delete'
                    );
                    (<HTMLElement>deleteAvatarBtn).style.display = 'block';

                    const backgroundOverlay = document.querySelector(
                        '.playlist__background-container'
                    );
                    (<HTMLElement>(
                        backgroundOverlay
                    )).style.backgroundImage = `linear-gradient(to bottom, ${body.artwork_color}, black)`;
                } else {
                    msg.classList.remove('success');
                    (<HTMLElement>msg).innerText = body.message;
                    msg.classList.add('fail', 'visible');
                }
            })
            .catch(() => {
                msg.classList.remove('success');
                (<HTMLElement>msg).innerText = 'Artwork changing failed';
                msg.classList.add('fail', 'visible');
            });
    }

    submitChangePlaylistInfoForm(event) {
        event.preventDefault();

        if (!this.playlist.getProps().is_own) {
            return;
        }

        const titleInput = event.target.querySelector('input[name="title"]');
        const msg = event.target.querySelector('.editwindow__form-msg');
        msg.innerHTML = '';
        if (!titleInput.value || titleInput.value.length < 4 || titleInput.value.length > 30) {
            msg.innerHTML = 'The length of title must be from 3 to 30 characters';
            msg.classList.add('fail', 'visible');
            return;
        }
        if (titleInput.value === this.playlist.getProps().title) {
            return;
        }

        this.playlist
            .updateInformation(
                titleInput.value,
                // FIXME костыль, потому что бэк присваивает is_public значение false, если он не указан в запросе
                this.playlist.getProps().is_public ? this.playlist.getProps().is_public : null,
            )
            .then((body) => {
                // при успехе ответ возвращает только artwork, без status
                if (!body.status) {
                    msg.classList.remove('fail');
                    msg.innerText = 'Changed successfully';
                    msg.classList.add('success', 'visible');
                    const title = document.querySelector(
                        '.playlist__description-title'
                    );
                    (<HTMLElement>title).innerText =
                        this.playlist.getProps().title;
                } else {
                    msg.classList.remove('success');
                    msg.innerText = body.message;
                    msg.classList.add('fail', 'visible');
                }
            })
            .catch(() => {
                msg.classList.remove('success');
                msg.innerText = 'Playlist changing failed';
                msg.classList.add('fail', 'visible');
            });
    }

    deleteButtonClick(event) {
        if (!this.playlist.getProps().is_own) {
            return;
        }

        if ((<HTMLElement>event.target).classList.contains('confirm')) {
            PlaylistModel.removePlaylist(this.playlist.getProps().id).then(
                () => {
                    router.go(routerStore.dashboard);
                }
            );
        } else {
            (<HTMLElement>event.target).innerText = 'Are you sure?';
            (<HTMLElement>event.target).classList.add('confirm');
        }
    }

    deleteButtonReset(event) {
        if (!this.playlist.getProps().is_own) {
            return;
        }

        const deleteBtn = document.querySelector(
            '.editwindow__delete'
        );
        if (event.target == deleteBtn) {
            return;
        }
        if (deleteBtn) {
            (<HTMLElement>deleteBtn).innerText = 'Delete playlist';
            deleteBtn.classList.remove('confirm');
        }
    }

    deleteAvatar(event) {
        if (!this.playlist.getProps().is_own) {
            return;
        }

        const msg = document.querySelector('.editwindow__form-msg');
        msg.innerHTML = '';

        this.playlist
            .deleteAvatar()
            .then((body) => {
                // при успехе ответ возвращает только artwork, без status
                if (!body.status) {
                    const avatarInEditWindow = document.querySelector(
                        '.editwindow__avatar-img'
                    );
                    avatarInEditWindow.setAttribute(
                        'src',
                        this.playlist.getProps().artwork
                    );

                    const avatar = document.querySelector(
                        '.playlist__description-img'
                    );
                    avatar.setAttribute(
                        'src',
                        this.playlist.getProps().artwork
                    );

                    const deleteAvatarBtn = document.querySelector(
                        '.editwindow__avatar-delete'
                    );
                    (<HTMLElement>deleteAvatarBtn).style.display = 'none';

                    msg.classList.remove('fail');
                    (<HTMLElement>msg).innerText = 'Changed successfully';
                    msg.classList.add('success', 'visible');

                    const backgroundOverlay = document.querySelector(
                        '.playlist__background-container'
                    );
                    (<HTMLElement>(
                        backgroundOverlay
                    )).style.backgroundImage = `linear-gradient(to bottom, ${body.artwork_color}, black)`;
                } else {
                    msg.classList.remove('success');
                    (<HTMLElement>msg).innerText = body.message;
                    msg.classList.add('fail', 'visible');
                }
            })
            .catch(() => {
                msg.classList.remove('success');
                (<HTMLElement>msg).innerText = 'Artwork resetting failed';
                msg.classList.add('fail', 'visible');
            });
    }

    togglePublicity(event) {
        const msg = document.querySelector('.editwindow__form-msg');
        msg.innerHTML = '';

        this.playlist
            .updateInformation(
                null,
                event.target.checked,
            )
            .then((body) => {
                // при успехе ответ возвращает только artwork, без status
                if (!body.status) {
                    msg.classList.remove('fail');
                    (<HTMLElement>msg).innerText = 'Changed successfully';
                    msg.classList.add('success', 'visible');
                    const title = document.querySelector(
                        '.playlist__description-title'
                    );
                    (<HTMLElement>title).innerText =
                        this.playlist.getProps().title;
                } else {
                    msg.classList.remove('success');
                    (<HTMLElement>msg).innerText = body.message;
                    msg.classList.add('fail', 'visible');
                }
            })
            .catch(() => {
                msg.classList.remove('success');
                (<HTMLElement>msg).innerText = 'Playlist changing failed';
                msg.classList.add('fail', 'visible');
            });
    }

    removeTrack() {
        this.contextMenu.removeTrackFromPlaylist(this.playlist)
            .then((response) => {
                if (response.status === 200) {
                    this.trackList.set({
                        title: 'Tracks',
                        tracks: this.playlist.getProps().tracks,
                    });
                    const trackList = document.querySelector('.playlist__content');
                    document
                        .querySelectorAll('.track-list-item-playlist')
                        .forEach((element) => {
                            element.removeEventListener(
                                'click',
                                this.contextMenu.showContextMenu.bind(this.contextMenu)
                            );
                        });
                    trackList.innerHTML = this.trackList.render();
                    document
                        .querySelectorAll('.track-list-item-playlist')
                        .forEach((element) => {
                            element.addEventListener(
                                'click',
                                this.contextMenu.showContextMenu.bind(this.contextMenu)
                            );
                        });
                }
            });

    }

    addListeners() {
        if (this.playlist.getProps().is_own) {
            const deleteAvatarBtn = document.querySelector(
                '.editwindow__avatar-delete'
            );
            deleteAvatarBtn.addEventListener(
                'click',
                this.deleteAvatar.bind(this)
            );

            const publicityCheckbox = document.querySelector(
                '.editwindow__form-switch input'
            );
            publicityCheckbox.addEventListener(
                'click',
                this.togglePublicity.bind(this)
            );

            const deleteBtn = document.querySelector(
                '.editwindow__delete'
            );
            deleteBtn.addEventListener(
                'click',
                this.deleteButtonClick.bind(this)
            );

            const form = document.querySelector('.editwindow__form');
            form.addEventListener(
                'submit',
                this.submitChangePlaylistInfoForm.bind(this)
            );
            const fileInput = document.querySelector('input[name="file"]');
            fileInput.addEventListener(
                'change',
                this.uploadAvatarFile.bind(this)
            );

            const editPlaylistBtn = document.querySelector(
                '.playlist__description-edit-btn'
            );
            editPlaylistBtn.addEventListener(
                'click',
                this.displayEditWindow.bind(this)
            );

            const playlistAvatar = document.querySelector(
                '.playlist__description-avatar'
            );
            playlistAvatar.addEventListener(
                'click',
                this.displayEditWindow.bind(this)
            );
            window.addEventListener('click', this.removeEditWindow.bind(this));
            window.addEventListener('click', this.deleteButtonReset.bind(this));

            const removeTrackFromPlaylistBtn = document.querySelector(
                '.js-playlist-track-remove'
            );
            removeTrackFromPlaylistBtn.addEventListener(
                'click',
                this.removeTrack.bind(this)
            );
        }

        window.addEventListener('click', this.contextMenu.hideContextMenu.bind(this.contextMenu));
        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.addEventListener('click', this.contextMenu.showContextMenu.bind(this.contextMenu));
            });

        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.addEventListener(
            'click',
            this.contextMenu.createNewPlaylist.bind(this.contextMenu)
        );

        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.addEventListener('click', this.contextMenu.addTrackToPlaylist.bind(this.contextMenu));
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
                    this.contextMenu.showContextMenu.bind(this.contextMenu)
                );
            });

        this.contextMenu.deleteRemoveButton();

        if (this.playlist && this.playlist.getProps().is_own) {
            const removeTrackFromPlaylistBtn = document.querySelector(
                '.js-playlist-track-remove'
            );
            removeTrackFromPlaylistBtn.removeEventListener(
                'click',
                this.removeTrack.bind(this)
            );

            window.removeEventListener(
                'click',
                this.deleteButtonReset.bind(this)
            );
            window.removeEventListener(
                'click',
                this.removeEditWindow.bind(this)
            );

            const playlistAvatar = document.querySelector(
                '.playlist__description-avatar'
            );
            playlistAvatar.removeEventListener(
                'click',
                this.displayEditWindow.bind(this)
            );

            const editPlaylistBtn = document.querySelector(
                '.playlist__description-edit-btn'
            );
            editPlaylistBtn.removeEventListener(
                'click',
                this.displayEditWindow.bind(this)
            );

            const fileInput = document.querySelector('input[name="file"]');
            fileInput.removeEventListener(
                'change',
                this.uploadAvatarFile.bind(this)
            );

            const form = document.querySelector('.editwindow__form');
            form.removeEventListener(
                'submit',
                this.submitChangePlaylistInfoForm.bind(this)
            );

            const deleteBtn = document.querySelector(
                '.editwindow__delete'
            );
            deleteBtn.removeEventListener(
                'click',
                this.deleteButtonClick.bind(this)
            );

            const deleteAvatarBtn = document.querySelector(
                '.editwindow__avatar-delete'
            );
            deleteAvatarBtn.removeEventListener(
                'click',
                this.deleteAvatar.bind(this)
            );
        }

        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.removeEventListener(
            'click',
            this.contextMenu.createNewPlaylist.bind(this.contextMenu)
        );
        const addTrackToPlaylistBtns = document.querySelectorAll(
            '.js-playlist-track-add'
        );
        addTrackToPlaylistBtns.forEach((button) => {
            button.removeEventListener('click', this.contextMenu.addTrackToPlaylist.bind(this.contextMenu));
        });

        window.removeEventListener('click', this.contextMenu.hideContextMenu.bind(this.contextMenu));

        this.isLoaded = false;
    }

    render(): void {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = PlaylistTemplate({
            title: this.playlist.getProps().title,
            avatar: this.playlist.getProps().artwork,
            is_own: this.playlist.getProps().is_own,
            is_public: this.playlist.getProps().is_public,
            topbar: TopbarComponent.set({
                authenticated: store.get('authenticated'),
                avatar: store.get('userAvatar'),
                offline: !navigator.onLine,
            }).render(),
            sidebar: sidebar.render(),
            trackList: this.trackList
                .set({
                    title: 'Tracks',
                    tracks: this.playlist.getProps().tracks,
                })
                .render(),
            player: player.render(),
            contextMenu: this.contextMenu.render(),
            inputs: this.inputs,
        });
        TopbarComponent.addHandlers();
        TopbarComponent.didMount();
        this.renderedMenu = document.querySelector('.menu');

        const deleteAvatarBtn = document.querySelector(
            '.editwindow__avatar-delete'
        );
        if (
            this.playlist.getProps().is_own &&
            this.playlist.getProps().artwork === DEFAULT_ARTWORK
        ) {
            (<HTMLElement>deleteAvatarBtn).style.display = 'none';
        }
        const backgroundOverlay = document.querySelector(
            '.playlist__background-container'
        );
        (<HTMLElement>(
            backgroundOverlay
        )).style.backgroundImage = `linear-gradient(to bottom, ${
            this.playlist.getProps().artwork_color
        }, black)`;
        this.addListeners();

        player.setup(document.querySelectorAll('.track-list-item'));
    }
}

export default new PlaylistView();
