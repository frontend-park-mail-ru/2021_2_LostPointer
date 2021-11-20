import { Sidebar } from 'components/Sidebar/sidebar';
import { TopAlbums } from 'components/TopAlbums/topalbums';
import Request from 'services/request/request';
import TopbarComponent from 'components/Topbar/topbar';
import { FriendActivity } from 'components/FriendActivity/friendactivity';
import { SuggestedArtists } from 'components/SuggestedArtists/suggestedartists';
import { TrackList } from 'components/TrackList/tracklist';
import { SuggestedPlaylists } from 'components/SuggestedPlaylists/suggestedplaylists';
import player from 'components/Player/player';
import { TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';
import { View } from 'views/View/view';
import disableBrokenImg from 'views/utils';

import store from 'services/store/store';

import IndexTemplate from './indexView.hbs';
import './indexView.scss';

interface IIndexViewProps {
    authenticated: boolean;
}

export class IndexView extends View<IIndexViewProps> {
    private authenticated: boolean;

    private top_albums: AlbumModel[];
    private suggested_artists: ArtistModel[];
    private track_list: TrackModel[];
    private suggested_playlists: SuggestedPlaylists;
    private sidebar: Sidebar;
    private friend_activity: FriendActivity;
    private userAvatar: string;

    constructor(props?: IIndexViewProps) {
        super(props);
        this.isLoaded = false;
    }

    didMount() {
        this.authenticated = store.get('authenticated');
        this.userAvatar = store.get('userAvatar');

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

        Promise.all([tracks, artists, albums]).then(() => {
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

        player.setup(document.querySelectorAll('.track-list-item'));

        document.querySelectorAll('img').forEach(function(img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function(img) {
            img.removeEventListener('error', disableBrokenImg);
        });

        const suggestedTracksContainer = document.querySelector(
            '.suggested-tracks-container'
        );
        this.isLoaded = false;
        player.unmount();
    }

    userLogout() {
        Request.post('/user/logout').then(() => {
            player.stop();
            player.clear();
            store.set('authenticated', false);
            this.authenticated = false;
            window.localStorage.removeItem('lastPlayedData');
            TopbarComponent.logout();
        });
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
                offline: navigator.onLine !== true,
            }).render(),
            sidebar: this.sidebar,
            friend_activity: this.friend_activity,
            top_albums: this.top_albums,
            suggested_artists: this.suggested_artists,
            track_list: this.track_list,
            suggested_playlists: this.suggested_playlists,
            player: player.render(),
        });
        TopbarComponent.didMount();
        this.addListeners();
    }
}

export default new IndexView();
