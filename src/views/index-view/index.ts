import { Component } from 'managers/component';
import { Sidebar } from 'components/sidebar/sidebar';
// import { PlayerComponent } from 'components/player/player';
// import { TopBar } from 'components/topbar/topbar';
// import { TopAlbums } from 'components/topalbums/topalbums';
// import { SuggestedPlaylists } from 'components/suggestedplaylists/suggestedplaylists';
// import { TrackList } from 'components/tracklist/tracklist';
// import { SuggestedArtists } from 'components/suggestedartists/suggestedartists';
// import { FriendActivity } from 'components/friendactivity/friendactivity';
// import Request from '../../../src/framework/appApi/request';
// eslint-disable-next-line import/no-cycle
// import { navigateTo } from '../../framework/core/router';
import { View } from "managers/base-view";
import {TopBar} from "components/topbar/topbar";
import {FriendActivity} from "components/friendactivity/friendactivity";

const Handlebars = require('handlebars');

const IndexTemplate = require('./index.hbs');

export class IndexView extends View {
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
        // Request.get(
        //     '/auth',
        // )
        //     .then(({ status }) => { this.authenticated = status === 200; });
        //
        // Request.get('/home').then((response) => {
        //     const albums = response.body.albums.map((e) => ({ img: e.artWork }));
        //     const predefinedPlaylists = [
        //         {
        //             cover: 'yur.jpg',
        //             title: 'Jail Mix',
        //         },
        //         {
        //             cover: 'albina.jpeg',
        //             title: 'Resine Working Mix Extended',
        //         },
        //         {
        //             cover: 'starboy.jpg',
        //             title: 'Workout Mix 2',
        //         },
        //     ];

            // this.props = {
            //     top_albums: new TopAlbums({ albums }),
            //     suggested_artists: new SuggestedArtists({ artists: response.body.artists }),
            //     track_list: new TrackList({ tracks: response.body.tracks }),
            //     suggested_playlists: new SuggestedPlaylists({ playlists: predefinedPlaylists }),
            //     sidebar: new Sidebar(null),
            //     topbar: new TopBar({ authenticated: this.authenticated }),
            //     friend_activity: new FriendActivity(null),
            //     player: new PlayerComponent(null),
            // };

            // @ts-ignore
            // Object.values(this.props).forEach((component) => { component.render(); });

            // this.props.top_albums.render();
            // this.props.suggested_artists.render();
            // this.props.track_list.render();
            // this.isLoaded = true;

        //     document.addEventListener('click', this.authHandler);
        //
        //     this.syncPlayButtonsHandler = (target, event) => {
        //         // eslint-disable-next-line no-param-reassign
        //         target.src = `/src/static/img/${event.type === 'play' ? 'pause' : 'play'}-outline.svg`;
        //     };
        //     this.playButtonHandler = (e) => {
        //         if (e.target.className === 'track-list-item-play') {
        //             if (!this.authenticated) {
        //                 navigateTo('/signin');
        //                 return;
        //             }
        //             if (e.target === this.props.player.nowPlaying) { // Ставим на паузу/продолжаем воспр.
        //                 this.props.player.toggle();
        //                 return;
        //             }
        //             if (this.props.player.nowPlaying) { // Переключили на другой трек
        //                 this.props.player.player.removeEventListener('play', this.props.player.currentHandler);
        //                 this.props.player.player.removeEventListener('pause', this.props.player.currentHandler);
        //                 this.props.player.nowPlaying.dataset.playing = 'false';
        //                 this.props.player.nowPlaying.src = '/src/static/img/play-outline.svg';
        //             }
        //
        //             this.props.player.pos = parseInt(e.target.dataset.pos, 10);
        //             this.props.player.nowPlaying = e.target; // Включили трек из списка
        //             // eslint-disable-next-line max-len
        //             this.props.player.currentHandler = this.syncPlayButtonsHandler.bind(null, this.props.player.nowPlaying);
        //             this.props.player.player.addEventListener('play', this.props.player.currentHandler);
        //             this.props.player.player.addEventListener('pause', this.props.player.currentHandler);
        //
        //             e.target.dataset.playing = 'true';
        //             this.props.player.setTrack({
        //                 url: `/src/static/tracks/${e.target.dataset.url}`,
        //                 cover: `/src/static/img/artworks/${e.target.dataset.cover}`,
        //                 title: e.target.dataset.title,
        //                 artist: e.target.dataset.artist,
        //                 album: e.target.dataset.album,
        //             });
        //         }
        //     };
        //     this.render();
        // });
    }

    unmount() {
        document.querySelectorAll('.track-list-item-play').forEach((e) => e.removeEventListener('click', this.playButtonHandler));
        document.removeEventListener('click', this.authHandler);
        document.querySelector('.suggested-tracks-container').removeEventListener('click', this.playButtonHandler);
        // this.props.player.unmount();
    }

    addHandlers() {
        // this.authHandler = (e) => {
        //     if (e.target.className === 'topbar-auth' && e.target.dataset.action === 'logout') {
        //         Request.post('/user/logout', {}, undefined).then(() => {
        //             this.props.player.player.pause();
        //             this.props.player.player.src = null;
        //             this.authenticated = false;
        //             this.props.topbar.data.authenticated = false;
        //             this.props.topbar.update();
        //             this.props.player.data = {};
        //             this.props.player.update();
        //             window.localStorage.removeItem('lastPlayedData');
        //         });
        //     }
        // };
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
        } else {
        }

        // if (this.props && this.props.player) {
        //     this.props.player.unmount();
        //     this.props.player.setup();
        //     this.props.player.playlist = document.querySelectorAll('.track-list-item');
        //     // @ts-ignore
        //     this.props.player.playlistIndices = [...Array(this.props.player.playlist.length).keys()];
        // }
        document.querySelectorAll('.track-list-item-play').forEach((e) => e.addEventListener('click', this.playButtonHandler));

        document.querySelector('.app').innerHTML = IndexTemplate({
            sidebar: new Sidebar().render(),
            topbar: new TopBar().render(),
            friend_activity: new FriendActivity({
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
                ]}).render(),
        });
    }
}
