import { Component } from 'components/component/component';
import { Sidebar } from 'components/sidebar/sidebar';
import { TopAlbums } from 'components/topalbums/topalbums';
import Request from '../../services/request/request';
import {TopBar} from "components/topbar/topbar";
import {FriendActivity} from "components/friendactivity/friendactivity";
import {SuggestedArtists} from "components/suggestedartists/suggestedartists";
import {TrackList} from "components/tracklist/tracklist";
import {SuggestedPlaylists} from "components/suggestedplaylists/suggestedplaylists";
import Player, {PlayerComponent} from "components/player/player";
// import {navigateTo} from 'src/services/router/router';

import '../../static/css/dashboard.css';

const IndexTemplate = require('./index.hbs');

interface IIndexViewProps {
    authenticated: boolean;
}

export class IndexView extends Component<IIndexViewProps> {
    private authenticated: boolean;
    private authHandler: (e) => void;
    private syncPlayButtonsHandler: (target, event) => void;
    private playButtonHandler: (e) => void;

    private top_albums: TopAlbums;
    private suggested_artists: SuggestedArtists;
    private track_list: TrackList;
    private suggested_playlists: SuggestedPlaylists;
    private player: PlayerComponent;
    private sidebar: Sidebar;
    private topbar: TopBar;
    private friend_activity: FriendActivity;
    private currentSyncHandler: EventHandlerNonNull;

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
            this.top_albums = new TopAlbums({ albums }).render();
            this.suggested_artists = new SuggestedArtists({ artists: response.body.artists }).render();
            this.track_list = new TrackList({ tracks: response.body.tracks }).render();
            this.suggested_playlists = new SuggestedPlaylists({ playlists: predefinedPlaylists }).render();
            this.player = Player;

            this.sidebar = new Sidebar().render();
            this.topbar = new TopBar().render();
            this.friend_activity = new FriendActivity({
                friends: [
                    {
                        img: '6f745898-a510-4fbc-af77-ad69bd9e9e76',
                        nickname: 'Frank Sinatra',
                        listening_to: 'Strangers in the Night',
                    },
                    {
                        img: '6f745898-a510-4fbc-af77-ad69bd9e9e76',
                        nickname: 'Земфира',
                        listening_to: 'Трафик',
                    },
                ]}).render();

            this.isLoaded = true;
            this.render();
        });
    }

    addListeners() {

        document.addEventListener('click', this.authHandler);

        this.syncPlayButtonsHandler = (target, event) => {
            // eslint-disable-next-line no-param-reassign
            target.src = `/src/static/img/${event.type === 'play' ? 'pause' : 'play'}-outline.svg`;
        };
        this.playButtonHandler = (e) => {
            if (e.target.className === 'track-list-item-play') {
                if (!this.authenticated) {
                    // navigateTo('/signin');
                    return;
                }
                if (e.target === this.player.nowPlaying) { // Ставим на паузу/продолжаем воспр.
                    this.player.toggle();
                    return;
                }
                if (this.player.nowPlaying) { // Переключили на другой трек
                    this.player.desyncPlayButtons(this.currentSyncHandler);
                    this.player.nowPlaying.dataset.playing = 'false';
                    this.player.nowPlaying.src = '/src/static/img/play-outline.svg';
                }

                this.player.pos = parseInt(e.target.dataset.pos, 10);

                this.player.nowPlaying = e.target; // Включили трек из списка
                // eslint-disable-next-line max-len
                this.currentSyncHandler = this.syncPlayButtonsHandler.bind(null, this.player.nowPlaying);
                this.player.syncPlayButtons(this.currentSyncHandler);

                e.target.dataset.playing = 'true';
                this.player.setTrack({
                    url: `/src/static/tracks/${e.target.dataset.url}`,
                    cover: `/src/static/img/artworks/${e.target.dataset.cover}`,
                    title: e.target.dataset.title,
                    artist: e.target.dataset.artist,
                    album: e.target.dataset.album,
                });
            }
        };

            this.player.setup(document.querySelectorAll('.track-list-item'));
    }

    unmount() {
        document.querySelectorAll('.track-list-item-play').forEach((e) => e.removeEventListener('click', this.playButtonHandler));
        document.removeEventListener('click', this.authHandler);
        document.querySelector('.suggested-tracks-container').removeEventListener('click', this.playButtonHandler);
        this.player.unmount();
    }

    addHandlers() {
        this.authHandler = (e) => {
            if (e.target.className === 'topbar-auth' && e.target.dataset.action === 'logout') {
                Request.post('/user/logout', {}, undefined).then(() => {
                    this.player.stop();
                    this.authenticated = false;
                    this.props.authenticated = false;
                    window.localStorage.removeItem('lastPlayedData');
                });
            }
        };
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.querySelectorAll('.track-list-item-play').forEach((e) => e.addEventListener('click', this.playButtonHandler));
        document.querySelector(' .app').innerHTML = IndexTemplate({
            topbar: this.topbar,
            sidebar: this.sidebar,
            friend_activity: this.friend_activity,
            top_albums: this.top_albums,
            suggested_artists: this.suggested_artists,
            track_list: this.track_list,
            suggested_playlists: this.suggested_playlists,
            player: this.player.render()
        });
        this.addListeners();
    }
}
