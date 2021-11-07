import { Sidebar } from 'components/Sidebar/sidebar';
import { TopAlbums } from 'components/TopAlbums/topalbums';
import Request from 'services/request/request';
import TopbarComponent, { Topbar } from 'components/Topbar/topbar';
import { FriendActivity } from 'components/FriendActivity/friendactivity';
import { SuggestedArtists } from 'components/SuggestedArtists/suggestedartists';
import { TrackList } from 'components/TrackList/tracklist';
import { SuggestedPlaylists } from 'components/SuggestedPlaylists/suggestedplaylists';
import player, { PlayerComponent } from 'components/Player/player';
import { TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';
import routerStore from 'services/router/routerStore';
import router from 'services/router/router';
import { View } from 'views/View/view';

import { UserModel } from 'models/user';

import IndexTemplate from './indexView.hbs';
import './indexView.scss';

interface IIndexViewProps {
    authenticated: boolean;
}

export class IndexView extends View<IIndexViewProps> {
    private authenticated: boolean;
    private authHandler: (e) => void;
    private playButtonHandler: (e) => void;

    private top_albums: AlbumModel[];
    private suggested_artists: ArtistModel[];
    private track_list: TrackModel[];
    private suggested_playlists: SuggestedPlaylists;
    private player: PlayerComponent;
    private sidebar: Sidebar;
    private topbar: Topbar;
    private friend_activity: FriendActivity;
    private userAvatar: string;

    constructor(props?: IIndexViewProps) {
        super(props);
        this.isLoaded = false;
    }

    didMount() {
        const auth = UserModel.auth().then((authResponse) => {
            this.authenticated = authResponse.authenticated;
            this.userAvatar = authResponse.avatar;
        });

        const tracks = TrackModel.getHomepageTracks().then((tracks) => {
            this.track_list = tracks;
        });
        const artists = ArtistModel.getHomepageArtists().then((artists) => {
            this.suggested_artists = artists;
        });
        const albums = AlbumModel.getHomepageAlbums().then((albums) => {
            this.top_albums = albums;
        });

        const predefinedPlaylists = [
            {
                cover: 'yur',
                title: 'Jail Mix',
            },
            {
                cover: 'albina',
                title: 'Resine Working Mix Extended',
            },
            {
                cover: 'starboy',
                title: 'Workout Mix 2',
            },
        ];

        Promise.all([auth, tracks, artists, albums]).then(() => {
            this.track_list = new TrackList({
                title: 'Tracks of the Week',
                tracks: this.track_list,
            }).render();
            this.suggested_playlists = new SuggestedPlaylists({
                playlists: predefinedPlaylists,
            }).render();
            this.sidebar = new Sidebar().render();

            this.top_albums = new TopAlbums({
                albums: this.top_albums,
            }).render();
            this.suggested_artists = new SuggestedArtists({
                artists: this.suggested_artists,
            }).render();

            this.friend_activity = new FriendActivity({
                friends: [
                    {
                        img: 'default_avatar_150px',
                        nickname: 'Frank Sinatra',
                        listening_to: 'Strangers in the Night',
                    },
                    {
                        img: 'default_avatar_150px',
                        nickname: 'Земфира',
                        listening_to: 'Трафик',
                    },
                ],
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

    unmount() {
        document
            .querySelectorAll('.track-list-item-play')
            .forEach((e) =>
                e.removeEventListener('click', this.playButtonHandler)
            );
        document.removeEventListener('click', this.authHandler);
        document
            .querySelector('.suggested-tracks-container')
            .removeEventListener('click', this.playButtonHandler);
        this.isLoaded = false;
        player.unmount();
    }

    userLogout() {
        Request.post('/user/logout').then(() => {
            player.stop();
            this.authenticated = false;
            player.clear();
            window.localStorage.removeItem('lastPlayedData');
            TopbarComponent.logout();
        });
    }

    // TODO: это надо переместить "наружу", туда, где будет хранение аваторизации, а то сейчас неотключаемо
    pause = time => new Promise(resolve => setTimeout(resolve, time));

    async runPeriodically(callback, getCondition, time) {
        let condition = true;
        while(condition) {
            condition = getCondition();
            await callback();
            await this.pause(time);
        }
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = IndexTemplate({
            topbar: TopbarComponent.set({
                authenticated: this.authenticated,
                avatar: this.userAvatar,
            }).render(),
            sidebar: this.sidebar,
            friend_activity: this.friend_activity,
            top_albums: this.top_albums,
            suggested_artists: this.suggested_artists,
            track_list: this.track_list,
            suggested_playlists: this.suggested_playlists,
            player: player.render(),
        });

        const topbarMessage = document.querySelector('.topbar__message');
        if ((navigator.onLine === true)) {
            (<HTMLElement>topbarMessage).innerText = '';
        } else {
            (<HTMLElement>topbarMessage).innerText = 'Internet is unavailable';
            this.runPeriodically(
                () => {
                    // TODO: поменять на вызов другой функции, типа healthcheck
                    Request.get('/auth').then(() => {router.go(routerStore.dashboard)});
                },
                () => {
                    return navigator.onLine !== true;
                },
                5000)
        }
        this.addListeners();
    }
}

export default new IndexView();
