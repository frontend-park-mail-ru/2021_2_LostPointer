import Request from 'services/request/request';
import player from 'components/Player/player';
import routerStore from 'services/router/routerStore';
import router from 'services/router/router';
import { View } from 'views/View/view';

import disableBrokenImg from 'views/utils';

import store from 'services/store/store';
import indexView from 'views/IndexView/indexView';
import { TrackModel } from 'models/track';
import { AlbumModel } from 'models/album';
import { ArtistModel } from 'models/artist';

import SearchViewTemplate from './searchView.hbs';
import './searchView.scss';
import { TrackList } from 'components/TrackList/tracklist';

interface ISearchViewData {
    tracks: string;
    albums: string;
    artists: string;
}

interface ISearchViewProps {
    authenticated: boolean;
}

const REQUEST_DELTA = 500;

export class SearchView extends View<ISearchViewProps> {
    private authenticated: boolean;
    private playButtonHandler: (e) => void;

    private userAvatar: string;
    private timestamp: number;
    private data: ISearchViewData;
    private tracks: TrackModel[];
    private artists: ArtistModel[];
    private albums: AlbumModel[];

    constructor(props?: ISearchViewProps) {
        super(props);
        this.isLoaded = false;
        this.data = {
            tracks: null,
            albums: null,
            artists: null,
        };
    }

    didMount() {
        this.authenticated = store.get('authenticated');
        this.userAvatar = store.get('userAvatar');
        this.isLoaded = true;
    }

    addListeners() {
        this.timestamp;
        document
            .querySelector('.topbar__search-input')
            .addEventListener('input', (e) => {
                const text = (<HTMLInputElement>e.target).value;
                Request.get(`/music/search?text=${text}`)
                    .then((response) => {
                        if (response.tracks) {
                            this.tracks = response.tracks.reduce(
                                (acc, elem) => {
                                    elem.album = new AlbumModel(elem.album);
                                    elem.artist = new ArtistModel(elem.artist);
                                    acc.push(new TrackModel(elem));
                                    return acc;
                                },
                                []
                            );
                        }
                        if (response.albums) {
                            this.albums = response.albums.reduce(
                                (acc, elem) => {
                                    acc.push(new AlbumModel(elem));
                                    return acc;
                                },
                                []
                            );
                        }
                        if (response.artists) {
                            this.artists = response.artists.reduce(
                                (acc, elem) => {
                                    acc.push(new ArtistModel(elem));
                                    return acc;
                                },
                                []
                            );
                        }
                    })
                    .then(() => {
                        this.update();
                    });
            });

        this.playButtonHandler = (e) => {
            if (e.target.className === 'track-list-item-play') {
                if (!store.get('authenticated')) {
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
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
        document
            .querySelectorAll('.track-list-item-play')
            .forEach((e) =>
                e.removeEventListener('click', this.playButtonHandler)
            );
        const suggestedTracksContainer = document.querySelector(
            '.suggested-tracks-container'
        );
        if (suggestedTracksContainer)
            suggestedTracksContainer.removeEventListener(
                'click',
                this.playButtonHandler
            );
        this.isLoaded = false;
        player.unmount();
    }

    render() {
        const app = document.getElementById('app');
        if (app.innerHTML == '') {
            indexView.render(); //TODO=Поправить этот КОШМАР
        }
        document.querySelector('.main-layout__content').innerHTML = '';
        this.addListeners();
    }

    update() {
        this.data.tracks = new TrackList({
            title: 'Tracks',
            tracks: this.tracks,
        }).render();
        const content = document.querySelector('.main-layout__content');

        content.innerHTML = SearchViewTemplate({
            tracks: this.data.tracks,
        });
        player.setup(document.querySelectorAll('.track-list-item'));
        document
            .querySelectorAll('.track-list-item-play')
            .forEach((e) =>
                e.addEventListener('click', this.playButtonHandler)
            );
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }
}

export default new SearchView();
