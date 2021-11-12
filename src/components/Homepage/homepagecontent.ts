import { Component } from 'components/Component/component';
import { TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';
import { TrackList } from 'components/TrackList/tracklist';
import { SuggestedPlaylists } from 'components/SuggestedPlaylists/suggestedplaylists';
import { TopAlbums } from 'components/TopAlbums/topalbums';
import { SuggestedArtists } from 'components/SuggestedArtists/suggestedartists';
import { FriendActivity } from 'components/FriendActivity/friendactivity';
import bus from 'services/eventbus/eventbus';

import { playButtonHandler } from 'components/common';

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
    private firstTimePlayed: boolean;

    constructor() {
        super();
        this.firstTimePlayed = true;
        this.addListeners();
    }

    reset() {
        this.firstTimePlayed = true;
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
            Promise.all([tracks, artists, albums]).then(() => {
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
            });
        });
    }

    addListeners() {
        bus.on('home-rendered', () => {
            document
                .querySelectorAll('.track-list-item-play')
                .forEach((e) =>
                    e.addEventListener('click', playButtonHandler.bind(this))
                );
        });
    }
}
