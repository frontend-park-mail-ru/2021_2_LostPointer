import { View } from 'views/View/view';
import { Sidebar } from 'components/Sidebar/sidebar';
import TopbarComponent, { Topbar } from 'components/Topbar/topbar';
import { TrackList } from 'components/TrackList/tracklist';
import { DEFAULT_ARTWORK, PlaylistModel } from 'models/playlist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import store from 'services/store/store';
import {
    addTrackToPlaylist,
    createNewPlaylist,
    disableBrokenImg,
    hideContextMenu,
    removeTrackFromPlaylist,
    showContextMenu,
} from 'views/utils';
import Request from 'services/request/request';
import player from 'components/Player/player';
import { InputFormComponent } from 'components/InputForm/inputform';
import { ContextMenu } from 'components/ContextMenu/contextMenu';

import PlaylistTemplate from './playlistView.hbs';
import './playlistView.scss';


// TODO service worker
// TODO подразбить на компоненты
// TODO почистить дубликаты кода (также в других вьюхах)
// TODO формировать formdata внутри модели (также в других вьюхах)

interface IPlaylistViewProps {
    authenticated: boolean;
}

export class PlaylistView extends View<IPlaylistViewProps> {
    private authenticated: boolean;
    private playButtonHandler: (e) => void;

    private sidebar: Sidebar;
    private topbar: Topbar;
    private userAvatar: string;
    private playlist: PlaylistModel;
    private userPlaylists: Array<PlaylistModel>;
    private trackList: TrackList;
    private inputs: Array<string>;
    private contextMenu: ContextMenu;
    private menuVisible: boolean;
    private renderedMenu: HTMLElement;
    private selectedTrackId: number;

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

        this.authenticated = store.get('authenticated');
        this.userAvatar = store.get('userAvatar');

        const playlist = PlaylistModel.getPlaylist(playlistId).then((playlist) => {
            if (!playlist) {
                router.go(routerStore.dashboard);
            }
            this.playlist = playlist;
        });

        const userPlaylists = PlaylistModel.getUserPlaylists().then((playlists) => {
            this.userPlaylists = playlists;
        });

        Promise.all([playlist, userPlaylists]).then(() => {
            this.topbar = TopbarComponent;
            this.sidebar = new Sidebar().render();
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
            ]
            this.contextMenu = new ContextMenu({
                options: [
                    {
                        class: 'js-playlist-create',
                        dataId: null,
                        value: 'Add to the new playlist',
                    },
                    {
                        class: 'js-playlist-track-remove',
                        dataId: null,
                        value: 'Remove from the current playlist',
                    },
                ].concat(this.userPlaylists.map((playlist) => {
                    return {
                        class: `js-playlist-track-add`,
                        dataId: playlist.getProps().id,
                        value: playlist.getProps().title,
                    }
                })),
            });
            this.isLoaded = true;
            this.render();
        });
    }

    displayEditWindow(event) {
        if (!this.authenticated) {
            return;
        }
        const playlistEditWindow = document.querySelector('.editwindow');
        (<HTMLElement>playlistEditWindow).style.display = 'block';
        event.stopPropagation();
    }
    removeEditWindow(event) {
        if (!this.authenticated) {
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

        const file = event.target.files[0];
        let readFile = null;
        const msg = document.querySelector('.editwindow__form-msg');
        (<HTMLElement>msg).innerText = '';

        const formdata = new FormData();
        formdata.append('artwork', file, file.name);

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
                const avatar = document.querySelector('.editwindow__avatar-img');
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
            .updateInformation(formdata)
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

                    const deleteAvatarBtn = document.querySelector('.editwindow__avatar-delete');
                    (<HTMLElement>deleteAvatarBtn).style.display = 'block';

                    const backgroundOverlay = document.querySelector('.playlist__background-container');
                    (<HTMLElement>backgroundOverlay).style.backgroundImage = `linear-gradient(to bottom, ${body.artwork_color}, black)`;
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

        const titleInput = event.target.querySelector('input[name="title"]');
        const msg = event.target.querySelector('.editwindow__form-msg');
        msg.innerHTML = '';
        if (!titleInput.value) {
            msg.innerHTML = 'Invalid title';
            msg.classList.add('fail', 'visible');
            return;
        }
        if (titleInput.value === this.playlist.getProps().title) {
            return;
        }

        const formdata = new FormData();
        formdata.append('title', titleInput.value);

        this.playlist
            .updateInformation(formdata)
            .then((body) => {
                // при успехе ответ возвращает только artwork, без status
                if (!body.status) {
                    msg.classList.remove('fail');
                    msg.innerText = 'Changed successfully';
                    msg.classList.add('success', 'visible');
                    const title = document.querySelector('.playlist__description-title');
                    (<HTMLElement>title).innerText = this.playlist.getProps().title;
                } else {
                    msg.classList.remove('success');
                    msg.innerText = body.message;
                    msg.classList.add('fail', 'visible');
                }
            })
            .catch(() => {
                msg.classList.remove('success');
                msg.innerText = 'Profile changing failed';
                msg.classList.add('fail', 'visible');
            });
    }

    deleteButtonClick(event) {
        if ((<HTMLElement>event.target).classList.contains('confirm')) {
            PlaylistModel.removePlaylist(this.playlist.getProps().id)
                .then(() => {
                    router.go(routerStore.dashboard);
                });
        } else {
            (<HTMLElement>event.target).innerText = 'Sure?';
            (<HTMLElement>event.target).classList.add('confirm');
        }
    }
    deleteButtonReset(event) {
        const deleteBtn = document.querySelector('.playlist__description-delete');
        if (event.target == deleteBtn) {
            return;
        }
        if (deleteBtn) {
            (<HTMLElement>deleteBtn).innerText = 'Delete playlist';
            deleteBtn.classList.remove('confirm');
        }
    }

    deleteAvatar(event) {
        const msg = document.querySelector('.editwindow__form-msg');
        msg.innerHTML = '';

        this.playlist
            .deleteAvatar()
            .then((body) => {
                // при успехе ответ возвращает только artwork, без status
                if (!body.status) {
                    const avatarInEditWindow = document.querySelector('.editwindow__avatar-img');
                    avatarInEditWindow.setAttribute(
                        'src',
                        this.playlist.getProps().artwork,
                    );

                    const avatar = document.querySelector(
                        '.playlist__description-img'
                    );
                    avatar.setAttribute(
                        'src',
                        this.playlist.getProps().artwork,
                    );

                    const deleteAvatarBtn = document.querySelector('.editwindow__avatar-delete');
                    (<HTMLElement>deleteAvatarBtn).style.display = 'none';

                    msg.classList.remove('fail');
                    (<HTMLElement>msg).innerText = 'Changed successfully';
                    msg.classList.add('success', 'visible');

                    const backgroundOverlay = document.querySelector('.playlist__background-container');
                    (<HTMLElement>backgroundOverlay).style.backgroundImage = `linear-gradient(to bottom, ${body.artwork_color}, black)`;
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

    addListeners() {
        if (this.authenticated) {
            document
                .querySelector('.js-logout')
                .addEventListener('click', this.userLogout);
        }

        const deleteAvatarBtn = document.querySelector('.editwindow__avatar-delete');
        deleteAvatarBtn.addEventListener('click', this.deleteAvatar.bind(this));

        const deleteBtn = document.querySelector('.playlist__description-delete');
        deleteBtn.addEventListener('click', (this.deleteButtonClick.bind(this)));

        const form = document.querySelector('.editwindow__form');
        form.addEventListener(
            'submit',
            this.submitChangePlaylistInfoForm.bind(this)
        );
        const fileInput = document.querySelector('input[name="file"]');
        fileInput.addEventListener('change', this.uploadAvatarFile.bind(this));

        const playlistAvatar = document.querySelector('.playlist__description-avatar');
        playlistAvatar.addEventListener('click', this.displayEditWindow.bind(this));
        window.addEventListener('click', this.removeEditWindow.bind(this));
        window.addEventListener('click', hideContextMenu.bind(this));
        window.addEventListener('click', this.deleteButtonReset.bind(this));
        document.querySelectorAll('.track-list-item-playlist').forEach((element) => {
            element.addEventListener('click', showContextMenu.bind(this));
        })

        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.addEventListener('click', createNewPlaylist.bind(this))
        const removeTrackFromPlaylistBtn = document.querySelector('.js-playlist-track-remove');
        removeTrackFromPlaylistBtn.addEventListener('click', removeTrackFromPlaylist.bind(this));
        const addTrackToPlaylistBtns = document.querySelectorAll('.js-playlist-track-add');
        addTrackToPlaylistBtns.forEach((button) => {
            button.addEventListener('click', addTrackToPlaylist.bind(this));
        });

        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
        document.querySelectorAll('.track-list-item-playlist').forEach((element) => {
            element.removeEventListener('click', showContextMenu.bind(this));
        })

        const deleteBtn = document.querySelector('.playlist__description-delete');
        deleteBtn.removeEventListener('click', (this.deleteButtonClick.bind(this)));

        const createPlaylistBtn = document.querySelector('.js-playlist-create');
        createPlaylistBtn.removeEventListener('click', createNewPlaylist.bind(this))
        const removeTrackFromPlaylistBtn = document.querySelector('.js-playlist-track-remove');
        removeTrackFromPlaylistBtn.removeEventListener('click', removeTrackFromPlaylist.bind(this));
        const addTrackToPlaylistBtns = document.querySelectorAll('.js-playlist-track-add');
        addTrackToPlaylistBtns.forEach((button) => {
            button.removeEventListener('click', addTrackToPlaylist.bind(this));
        });

        window.removeEventListener('click', this.deleteButtonReset.bind(this));
        window.removeEventListener('click', hideContextMenu.bind(this));
        window.removeEventListener('click', this.removeEditWindow.bind(this));

        const deleteAvatarBtn = document.querySelector('.editwindow__avatar-delete');
        deleteAvatarBtn.removeEventListener('click', this.deleteAvatar.bind(this));

        const playlistAvatar = document.querySelector('.playlist__description-avatar');
        playlistAvatar.removeEventListener('click', this.displayEditWindow.bind(this));
        this.isLoaded = false;
    }

    userLogout() {
        Request.post('/user/logout').then(() => {
            player.stop();
            this.authenticated = false;
            store.set('authenticated', false);
            player.clear();
            window.localStorage.removeItem('lastPlayedData');
            TopbarComponent.logout();
        });
    }

    render(): void {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = PlaylistTemplate({
            title: this.playlist.getProps().title,
            avatar: this.playlist.getProps().artwork,
            topbar: this.topbar
                .set({
                    authenticated: this.authenticated,
                    avatar: this.userAvatar,
                    offline: !navigator.onLine
                })
                .render(),
            sidebar: this.sidebar,
            trackList: this.trackList.set({
                title: 'Tracks',
                tracks: this.playlist.getProps().tracks,
            }).render(),
            player: player.render(),
            contextMenu: this.contextMenu.render(),
            inputs: this.inputs,
        });
        this.renderedMenu = document.querySelector('.menu');
        this.menuVisible = false;

        const deleteAvatarBtn = document.querySelector('.editwindow__avatar-delete');
        if (this.playlist.getProps().artwork === DEFAULT_ARTWORK) {
            (<HTMLElement>deleteAvatarBtn).style.display = 'none';
        }
        const backgroundOverlay = document.querySelector('.playlist__background-container');
        (<HTMLElement>backgroundOverlay).style.backgroundImage = `linear-gradient(to bottom, ${this.playlist.getProps().artwork_color}, black)`;
        this.addListeners();

        this.playButtonHandler = (e) => {
            if (e.target.className === 'track-list-item-play') {
                if (!this.authenticated) {
                    router.go(routerStore.signin);
                    return;
                }
                if (e.target === player.nowPlaying) {
                    // Ставим на паузу/продолжаем воспр.
                    player.toggle();
                    return;
                }
                if (player.nowPlaying) {
                    // Переключили на другой трек
                    player.nowPlaying.dataset.playing = 'false';
                    player.nowPlaying.src = '/static/img/play-outline.svg';
                }

                player.setPos(parseInt(e.target.dataset.pos, 10), e.target);

                e.target.dataset.playing = 'true';
                player.setTrack({
                    url: `/static/tracks/${e.target.dataset.url}`,
                    cover: `/static/artworks/${e.target.dataset.cover}`,
                    title: e.target.dataset.title,
                    artist: e.target.dataset.artist,
                    album: e.target.dataset.album,
                });
            }
        };
        player.setup(document.querySelectorAll('.track-list-item'));
        document
            .querySelectorAll('.track-list-item-play')
            .forEach((e) =>
                e.addEventListener('click', this.playButtonHandler)
            );
    }
}

export default new PlaylistView();
