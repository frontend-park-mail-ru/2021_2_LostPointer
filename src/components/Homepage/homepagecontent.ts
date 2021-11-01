import { Component } from 'components/Component/component';
import { TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';
import { TrackList } from 'components/TrackList/tracklist';
import { SuggestedPlaylists } from 'components/SuggestedPlaylists/suggestedplaylists';
import { TopAlbums } from 'components/TopAlbums/topalbums';
import { SuggestedArtists } from 'components/SuggestedArtists/suggestedartists';
import { FriendActivity } from 'components/FriendActivity/friendactivity';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import bus from 'services/eventbus/eventbus';
import store from 'services/store/store';

import HomepageTemplate from './homepagecontent.hbs';
import './homepagecontent.scss';

interface IHomepageProps {
    top_albums: TopAlbums;
    suggested_artists: ArtistModel[];
    track_list: TrackModel[];
    suggested_playlists: SuggestedPlaylists;
    friend_activity: FriendActivity;
}

export class Homepage extends Component<IHomepageProps> {
    private top_albums: AlbumModel[];
    private suggested_artists: ArtistModel[];
    private track_list: TrackModel[];
    private suggested_playlists: SuggestedPlaylists;
    private friend_activity: FriendActivity;
    private playButtonHandler: (e) => void;

    constructor() {
        super();
        this.addHandlers();
        this.addListeners();
    }

    render() {
        return HomepageTemplate(this.props); //TODO=переделать на this.data
    }

    getData(): Promise<boolean> {
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
        return new Promise((resolve) => {
            Promise.all([tracks, artists, albums])
                .then(() => {
                    this.props.track_list = new TrackList({
                        tracks: this.track_list,
                    }).render();
                    this.props.suggested_playlists = new SuggestedPlaylists({
                        playlists: predefinedPlaylists,
                    }).render();

                    this.props.top_albums = new TopAlbums({
                        albums: this.top_albums,
                    }).render();
                    this.props.suggested_artists = new SuggestedArtists({
                        artists: this.suggested_artists,
                    }).render();

                    this.props.friend_activity = new FriendActivity({
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
                    resolve(true);
                })
                .catch(() => {
                    // Show that backend is dead somehow
                });
        });
    }

    addHandlers() {
        this.playButtonHandler = (e) => {
            if (e.target.className === 'track-list-item-play') {
                if (!store.get('authenticated')) {
                    router.go(routerStore.signin);
                    return;
                }
                if (e.target === store.get('nowPlaying')) {
                    // Ставим на паузу/продолжаем воспр.
                    bus.emit('toggle-player');
                    return;
                }
                if (store.get('nowPlaying')) {
                    // Переключили на другой трек
                    store.get('nowPlaying').dataset.playing = 'false';
                    store.get('nowPlaying').src =
                        '/static/img/play-outline.svg';
                }

                bus.emit('set-player-pos', {
                    pos: parseInt(e.target.dataset.pos, 10),
                    target: e.target,
                });

                e.target.dataset.playing = 'true';

                bus.emit('set-player-track', {
                    url: `/static/tracks/${e.target.dataset.url}`,
                    cover: `/static/artworks/${e.target.dataset.cover}`,
                    title: e.target.dataset.title,
                    artist: e.target.dataset.artist,
                    album: e.target.dataset.album,
                });
            }
        };
    }

    addListeners() {
        bus.on('home-rendered', () => {
            document
                .querySelectorAll('.track-list-item-play')
                .forEach((e) =>
                    e.addEventListener('click', this.playButtonHandler)
                );
        });
    }
}
