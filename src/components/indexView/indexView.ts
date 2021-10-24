import { Component } from 'components/component/component';
import { Sidebar } from 'components/sidebar/sidebar';
import { TopAlbums } from 'components/topalbums/topalbums';
import Request from '../../services/request/request';
import TopbarComponent, {Topbar} from "components/topbar/topbar";
import {FriendActivity} from "components/friendactivity/friendactivity";
import {SuggestedArtists} from "components/suggestedartists/suggestedartists";
import {TrackList} from "components/tracklist/tracklist";
import {SuggestedPlaylists} from "components/suggestedplaylists/suggestedplaylists";
import Player, {PlayerComponent} from "components/player/player";
import {navigateTo} from 'services/router/router';

import './indexView.scss';
import {Track} from "models/track";
import {Artist} from "models/artist";
import {Album} from "models/album";

import IndexTemplate from './indexView.hbs';

interface IIndexViewProps {
    authenticated: boolean;
}

export class IndexView extends Component<IIndexViewProps> {
    private authenticated: boolean;
    private authHandler: (e) => void;
    private playButtonHandler: (e) => void;

    private top_albums: TopAlbums;
    private suggested_artists: SuggestedArtists;
    private track_list: Track[];
    private suggested_playlists: SuggestedPlaylists;
    private player: PlayerComponent;
    private sidebar: Sidebar;
    private topbar: Topbar;
    private friend_activity: FriendActivity;
    private userAvatar: string;

    constructor() {
        super();
        this.isLoaded = false;
        this.addHandlers();
    }

    didMount() {
        const auth = Request.get(
            '/auth',
        )
            .then(( response ) => {
                this.authenticated = response.status === 200;
                this.userAvatar = response.avatar;
            });

        const tracks = Track.getHomepageTracks().then((tracks) => { this.track_list = tracks; });
        const artists = Artist.getHomepageArtists().then((response) => { this.suggested_artists = response; });
        const albums = Album.getHomepageAlbums().then((response) => { this.top_albums = response; });

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
            this.track_list = new TrackList({ tracks: this.track_list }).render();
            this.suggested_playlists = new SuggestedPlaylists({ playlists: predefinedPlaylists }).render();
            this.player = Player;
            this.topbar = TopbarComponent;
            this.sidebar = new Sidebar().render();

            this.top_albums = new TopAlbums({ albums: this.top_albums }).render();
            this.suggested_artists = new SuggestedArtists({ artists: this.suggested_artists }).render();

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
                ]}).render();

            this.isLoaded = true;
            this.render();
        });
    }

    addListeners() {

        document.addEventListener('click', this.authHandler);

        this.playButtonHandler = (e) => {
            if (e.target.className === 'track-list-item-play') {
                if (!this.authenticated) {
                    navigateTo('/signin');
                    return;
                }
                if (e.target === this.player.nowPlaying) { // Ставим на паузу/продолжаем воспр.
                    this.player.toggle();
                    return;
                }
                if (this.player.nowPlaying) { // Переключили на другой трек
                    this.player.nowPlaying.dataset.playing = 'false';
                    this.player.nowPlaying.src = '/src/static/img/play-outline.svg';
                }

                this.player.setPos(parseInt(e.target.dataset.pos, 10), e.target);

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
        document.querySelectorAll('.track-list-item-play').forEach((e) => e.addEventListener('click', this.playButtonHandler));
    }

    unmount() {
        document.querySelectorAll('.track-list-item-play').forEach((e) => e.removeEventListener('click', this.playButtonHandler));
        document.removeEventListener('click', this.authHandler);
        document.querySelector('.suggested-tracks-container').removeEventListener('click', this.playButtonHandler);
        this.isLoaded = false;
        this.player.unmount();
    }

    addHandlers() {
        this.authHandler = (e) => {
            if (e.target.className === 'topbar-auth' && e.target.dataset.action === 'logout') {
                Request.post('/user/logout').then(() => {
                    this.player.stop();
                    this.authenticated = false;
                    this.props.authenticated = false;
                    this.player.clear();
                    window.localStorage.removeItem('lastPlayedData');
                    this.topbar.logout();
                });
            }
        };
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.querySelector(' .app').innerHTML = IndexTemplate({
            topbar: this.topbar.set({authenticated: this.authenticated, avatar: this.userAvatar}).render(),
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

export default new IndexView();