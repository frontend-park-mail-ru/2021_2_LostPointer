import { Component } from 'managers/component';
import { Sidebar } from '../sidebar/sidebar';
import { PlayerComponent } from '../player/player';
import { TopBar } from '../topbar/topbar';
import { TopAlbums } from '../topalbums/topalbums';
import { SuggestedPlaylists } from '../suggestedplaylists/suggestedplaylists';
import { TrackList } from '../tracklist/tracklist';
import { SuggestedArtists } from '../suggestedartists/suggestedartists';
import { FriendActivity } from '../friendactivity/friendactivity';
import Request from '../../../src/framework/appApi/request';
// eslint-disable-next-line import/no-cycle
import { navigateTo } from '../../framework/core/router';

const AppTemplate = require('./app.hbs');

export class AppComponent extends Component {
    private authenticated: boolean;
    private authHandler: (e) => void;
    private syncPlayButtonsHandler: (target, event) => void;
    private playButtonHandler: (e) => void;

    constructor(props) {
        super(props);
        this.isLoaded = false;
        this.addHandlers();
    }

    didMount() {
        Request.get(
            '/auth',
        )
            .then(({ status }) => { this.authenticated = status === 200; });

        Request.get('/home').then((response) => {
            const albums = response.body.albums.map((e) => ({ img: e.artWork }));
            const predefinedPlaylists = [
                {
                    cover: 'yur.jpg',
                    title: 'Jail Mix',
                },
                {
                    cover: 'albina.jpeg',
                    title: 'Resine Working Mix Extended',
                },
                {
                    cover: 'starboy.jpg',
                    title: 'Workout Mix 2',
                },
            ];

            this.data = {
                top_albums: new TopAlbums({ albums }),
                suggested_artists: new SuggestedArtists({ artists: response.body.artists }),
                track_list: new TrackList({ tracks: response.body.tracks }),
                suggested_playlists: new SuggestedPlaylists({ playlists: predefinedPlaylists }),
                sidebar: new Sidebar(null),
                topbar: new TopBar({ authenticated: this.authenticated }),
                friend_activity: new FriendActivity(null),
                player: new PlayerComponent(null),
            };

            // @ts-ignore
            Object.values(this.data).forEach((component) => { component.render(); });

            this.data.top_albums.render();
            this.data.suggested_artists.render();
            this.data.track_list.render();
            this.isLoaded = true;
            this.template = AppTemplate;
            console.log(this.template);

            document.addEventListener('click', this.authHandler);

            this.syncPlayButtonsHandler = (target, event) => {
                // eslint-disable-next-line no-param-reassign
                target.src = `/src/static/img/${event.type === 'play' ? 'pause' : 'play'}-outline.svg`;
            };
            this.playButtonHandler = (e) => {
                if (e.target.className === 'track-list-item-play') {
                    if (!this.authenticated) {
                        navigateTo('/signin');
                        return;
                    }
                    if (e.target === this.data.player.nowPlaying) { // Ставим на паузу/продолжаем воспр.
                        this.data.player.toggle();
                        return;
                    }
                    if (this.data.player.nowPlaying) { // Переключили на другой трек
                        this.data.player.player.removeEventListener('play', this.data.player.currentHandler);
                        this.data.player.player.removeEventListener('pause', this.data.player.currentHandler);
                        this.data.player.nowPlaying.dataset.playing = 'false';
                        this.data.player.nowPlaying.src = '/src/static/img/play-outline.svg';
                    }

                    this.data.player.pos = parseInt(e.target.dataset.pos, 10);
                    this.data.player.nowPlaying = e.target; // Включили трек из списка
                    // eslint-disable-next-line max-len
                    this.data.player.currentHandler = this.syncPlayButtonsHandler.bind(null, this.data.player.nowPlaying);
                    this.data.player.player.addEventListener('play', this.data.player.currentHandler);
                    this.data.player.player.addEventListener('pause', this.data.player.currentHandler);

                    e.target.dataset.playing = 'true';
                    this.data.player.setTrack({
                        url: `/src/static/tracks/${e.target.dataset.url}`,
                        cover: `/src/static/img/artworks/${e.target.dataset.cover}`,
                        title: e.target.dataset.title,
                        artist: e.target.dataset.artist,
                        album: e.target.dataset.album,
                    });
                }
            };
            this.render();
        });
    }

    unmount() {
        document.querySelectorAll('.track-list-item-play').forEach((e) => e.removeEventListener('click', this.playButtonHandler));
        document.removeEventListener('click', this.authHandler);
        document.querySelector('.suggested-tracks-container').removeEventListener('click', this.playButtonHandler);
        this.data.player.unmount();
    }

    addHandlers() {
        this.authHandler = (e) => {
            if (e.target.className === 'topbar-auth' && e.target.dataset.action === 'logout') {
                Request.post('/user/logout', {}, undefined).then(() => {
                    this.data.player.player.pause();
                    this.data.player.player.src = null;
                    this.authenticated = false;
                    this.data.topbar.data.authenticated = false;
                    this.data.topbar.update();
                    this.data.player.data = {};
                    this.data.player.update();
                    window.localStorage.removeItem('lastPlayedData');
                });
            }
        };
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
        } else {
            super.render();
        }

        if (this.data && this.data.player) {
            this.data.player.unmount();
            this.data.player.setup();
            this.data.player.playlist = document.querySelectorAll('.track-list-item');
            // @ts-ignore
            this.data.player.playlistIndices = [...Array(this.data.player.playlist.length).keys()];
        }
        document.querySelectorAll('.track-list-item-play').forEach((e) => e.addEventListener('click', this.playButtonHandler));
    }
}
