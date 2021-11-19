import { View } from 'views/View/view';
import { Sidebar } from 'components/Sidebar/sidebar';
import { AlbumModel } from 'models/album';
import { TrackList } from 'components/TrackList/tracklist';
import TopbarComponent, { Topbar } from 'components/Topbar/topbar';
import Request from 'services/request/request';
import player from 'components/Player/player';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';

import disableBrokenImg from 'views/utils';
import AlbumTemplate from './albumView.hbs';
import './albumView.scss';
import store from 'services/store/store';

interface IAlbumViewProps {
    authenticated: boolean;
}

export class AlbumView extends View<IAlbumViewProps> {
    private authenticated: boolean;
    private playButtonHandler: (e) => void;

    private sidebar: Sidebar;
    private topbar: Topbar;
    private userAvatar: string;
    private album: AlbumModel;
    private trackList: TrackList;

    constructor(props?: IAlbumViewProps) {
        super(props);
        this.isLoaded = false;
    }

    didMount() {
        const regex = /^\/album\/(\d+)$/gm;
        const match = regex.exec(window.location.pathname);
        if (!match) {
            router.go(routerStore.dashboard);
        }
        const albumId = match[1];

        this.authenticated = store.get('authenticated');
        this.userAvatar = store.get('userAvatar');

        const album = AlbumModel.getAlbum(albumId).then((album) => {
            if (!album) {
                router.go(routerStore.dashboard);
            }
            this.album = album;
        });

        Promise.all([album]).then(() => {
            this.topbar = TopbarComponent;
            this.sidebar = new Sidebar().render();
            const props = this.album.getProps();
            this.trackList = new TrackList({
                title: 'Tracks',
                tracks: props.tracks,
            }).render();
            this.isLoaded = true;
            this.render();
        });
    }

    addListeners() {
        if (this.authenticated) {
            document
                .querySelector('.js-logout')
                .addEventListener('click', this.userLogout);
        }

        document.querySelectorAll('img').forEach(function(img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function(img) {
            img.removeEventListener('error', disableBrokenImg);
        });
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

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = AlbumTemplate({
            sidebar: this.sidebar,
            topbar: this.topbar
                .set({
                    authenticated: this.authenticated,
                    avatar: this.userAvatar,
                    offline: !navigator.onLine,
                })
                .render(),
            artWork: '/static/artworks/' + this.album.getProps().artwork + '_512px.webp',
            title: this.album.getProps().title,
            trackList: this.trackList,
            player: player.render(),
            tracksCount: this.album.getProps().tracks_count,
            tracksDurationMin: Math.floor((this.album.getProps().tracks_duration / 60)),
            tracksDurationSec: Math.floor((this.album.getProps().tracks_duration % 60)),
            album: this.album.getProps(),
        });
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
                e.addEventListener('click', this.playButtonHandler),
            );
    }
}

export default new AlbumView();
