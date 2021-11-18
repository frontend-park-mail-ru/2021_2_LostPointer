import { View } from 'views/View/view';
import { Sidebar } from 'components/Sidebar/sidebar';
import TopbarComponent, { Topbar } from 'components/Topbar/topbar';
import { TrackList } from 'components/TrackList/tracklist';
import { PlaylistModel } from 'models/playlist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import store from 'services/store/store';
import disableBrokenImg from 'views/utils';
import Request from 'services/request/request';
import player from 'components/Player/player';

import PlaylistTemplate from './playlistView.hbs';
import './playlistView.scss';
import { InputFormComponent } from 'components/InputForm/inputform';
import { ContextMenu } from 'components/ContextMenu/contextMenu';


// TODO стили сообщения в окне обновления информации
// TODO анимация появления контекстного меню, как у подписи к значку оффлайна
// TODO координаты контекстного меню, привязанные к координатам кнопки, а не курсора
// TODO центрировать список песен
// TODO градиент на фоне
// TODO service worker
// TODO не отправлять запрос, если значение title не меняется

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
        const playlistId = match[1];

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
            }).render();
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
                        value: 'Добавить в новый плейлист',
                    },
                    {
                        class: 'js-playlist-track-remove',
                        value: 'Удалить из текущего плейлиста',
                    },
                ].concat(this.userPlaylists.map((playlist) => {
                    return {
                        class: `js-playlist-track-add-${playlist.getProps().id}`,
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
        const formdata = new FormData();
        formdata.append('title', titleInput.value);

        this.playlist
            .updateInformation(formdata)
            .then((body) => {
                if (body.status === 200) {
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

    addListeners() {
        if (this.authenticated) {
            document
                .querySelector('.js-logout')
                .addEventListener('click', this.userLogout);
        }

        const form = document.querySelector('.editwindow__form');
        form.addEventListener(
            'submit',
            this.submitChangePlaylistInfoForm.bind(this)
        );

        const playlistAvatar = document.querySelector('.playlist__description-avatar');
        playlistAvatar.addEventListener('click', this.displayEditWindow.bind(this));
        window.addEventListener('click', this.removeEditWindow.bind(this));
        window.addEventListener('click', this.hideContextMenu.bind(this));
        document.querySelectorAll('.track-list-item-playlist').forEach((element) => {
            element.addEventListener('click', this.showContextMenu.bind(this));
        })

        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
        document.querySelectorAll('.track-list-item-playlist').forEach((element) => {
            element.removeEventListener('click', this.showContextMenu.bind(this));
        })
        window.removeEventListener('click', this.hideContextMenu.bind(this));
        window.removeEventListener('click', this.removeEditWindow.bind(this));
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

    toggleMenu(command) {
        this.renderedMenu.style.visibility = command === 'show' ? 'visible' : 'hidden';
        this.renderedMenu.style.opacity = command === 'show' ? '1' : '0';
        this.menuVisible = command === 'show';
    }

    setPosition({top, left}) {
        this.renderedMenu.style.left = `${left}px`;
        this.renderedMenu.style.top = `${top}px`;
        this.toggleMenu('show');
    }

    hideContextMenu() {
        if (!this.authenticated) {
            return;
        }
        if (this.menuVisible) {
            this.toggleMenu('hide');
        }
    }

    showContextMenu(event) {
        if (!this.authenticated) {
            return;
        }
        const origin = {
            left: event.pageX,
            top: event.pageY
        };
        this.setPosition(origin);
        event.stopPropagation();
    }

    render(): void {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = PlaylistTemplate({
            title: this.playlist.getProps().title,
            avatar: this.playlist.getProps().avatar,
            topbar: this.topbar
                .set({
                    authenticated: this.authenticated,
                    avatar: this.userAvatar,
                    offline: !navigator.onLine
                })
                .render(),
            sidebar: this.sidebar,
            trackList: this.trackList,
            player: player.render(),
            contextMenu: this.contextMenu.render(),
            inputs: this.inputs,
        });
        this.renderedMenu = document.querySelector('.menu');
        this.menuVisible = false;
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
