import { View } from 'views/View/view';
import Request from 'services/request/request';
import player from 'components/Player/player';
import { Sidebar } from 'components/Sidebar/sidebar';
import TopbarComponent, { Topbar } from 'components/Topbar/topbar';
import { SuggestedAlbums } from 'components/SugestedAlbums/suggestedAlbums';
import { TrackList } from 'components/TrackList/tracklist';
import { ArtistModel } from 'models/artist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';

import store from 'services/store/store';

import ArtistTemplate from './artistView.hbs';
import './artistView.scss';

interface IArtistViewProps {
    authenticated: boolean;
}

export class ArtistView extends View<IArtistViewProps> {
    private authenticated: boolean;
    private authHandler: (e) => void;
    private playButtonHandler: (e) => void;

    private sidebar: Sidebar;
    private topbar: Topbar;
    private userAvatar: string;
    private artist: ArtistModel;
    private trackList: TrackList;
    private albumList: SuggestedAlbums;

    constructor(props?: IArtistViewProps) {
        super(props);
        this.isLoaded = false;
        this.addHandlers();
    }

    didMount() {
        const regex = /^\/artist\/(\d+)$/gm;
        const match = regex.exec(window.location.pathname);
        if (!match) {
            router.go(routerStore.dashboard);
        }
        const artistId = match[1];

        const auth = Request.get('/auth').then((response) => {
            this.authenticated = response.status === 200;
            this.userAvatar = response.avatar;
        });

        const artist = ArtistModel.getArtist(artistId).then((artist) => {
            if (!artist) {
                router.go(routerStore.dashboard);
            }
            this.artist = artist;
        });

        Promise.all([auth, artist]).then(() => {
            this.topbar = TopbarComponent;
            this.sidebar = new Sidebar().render();
            this.albumList = new SuggestedAlbums({
                albums: this.artist.getProps().albums,
            }).render();
            const props = this.artist.getProps();
            const tracks = props.tracks.map((track) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                track.props.artist = this.artist;
                //TODO=ПОПРАВИТЬ!!!
                return track;
            });
            this.trackList = new TrackList({
                title: 'Tracks',
                tracks: tracks,
            }).render();
            this.isLoaded = true;
            this.render();
        });
    }

    addListeners() {
        const video = document.querySelector('.artist__background-video');
        if (video) {
            video.addEventListener('ended', () => {
                video.classList.add('transition');
            });
        }
    }

    unmount() {
        this.isLoaded = false;
    }

    addHandlers() {
        this.authHandler = (e) => {
            if (
                e.target.className === 'topbar-auth' &&
                e.target.dataset.action === 'logout'
            ) {
                Request.post('/user/logout').then(() => {
                    player.stop();
                    this.authenticated = false;
                    this.props.authenticated = false;
                    player.clear();
                    window.localStorage.removeItem('lastPlayedData');
                    this.topbar.logout();
                });
            }
        };
        document.addEventListener('click', this.authHandler);
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = ArtistTemplate({
            name: this.artist.getProps().name,
            video: this.artist.getProps().video,
            artistAvatar: this.artist.getProps().avatar,
            topbar: this.topbar
                .set({
                    authenticated: this.authenticated,
                    avatar: this.userAvatar,
                })
                .render(),
            sidebar: this.sidebar,
            albumList: this.albumList,
            trackList: this.trackList,
            player: player.render(),
        });
        this.addListeners();

        this.playButtonHandler = (e) => {
            if (e.target.className === 'track-list-item-play') {
                if (!this.authenticated) {
                    router.go(routerStore.signin);
                    return;
                }
                if (e.target === store.get('nowPlaying')) {
                    // Ставим на паузу/продолжаем воспр.
                    player.toggle();
                    return;
                }
                if (store.get('nowPlaying')) {
                    // Переключили на другой трек
                    const nowPlaying = store.get('nowPlaying');
                    nowPlaying.dataset.playing = 'false';
                    nowPlaying.src = '/static/img/play-outline.svg';
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

export default new ArtistView();
