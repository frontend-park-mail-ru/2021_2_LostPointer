import Request from 'services/request/request';
import player from 'components/Player/player';
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
import { SuggestedArtists } from 'components/SuggestedArtists/suggestedartists';
import { SuggestedAlbums } from 'components/SugestedAlbums/suggestedAlbums';

interface ISearchViewData {
    tracks: string;
    albums: string;
    artists: string;
}

interface ISearchViewProps {
    authenticated: boolean;
}

export class SearchView extends View<ISearchViewProps> {
    private authenticated: boolean;

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
                        this.tracks = response.tracks
                            ? response.tracks.reduce((acc, elem) => {
                                  elem.album = new AlbumModel(elem.album);
                                  elem.artist = new ArtistModel(elem.artist);
                                  acc.push(new TrackModel(elem));
                                  return acc;
                              }, [])
                            : [];
                        this.albums = response.albums
                            ? response.albums.reduce((acc, elem) => {
                                  acc.push(new AlbumModel(elem));
                                  return acc;
                              }, [])
                            : [];
                        this.artists = response.artists
                            ? response.artists.reduce((acc, elem) => {
                                  acc.push(new ArtistModel(elem));
                                  return acc;
                              }, [])
                            : [];
                    })
                    .then(() => {
                        this.update();
                    });
            });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });

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
        this.data.tracks =
            this.tracks.length !== 0
                ? new TrackList({
                      title: 'Tracks',
                      tracks: this.tracks,
                  }).render()
                : [];
        this.data.artists =
            this.artists.length !== 0
                ? new SuggestedArtists({
                      artists: this.artists,
                  }).render()
                : [];
        this.data.albums =
            this.albums.length !== 0
                ? new SuggestedAlbums({
                      albums: this.albums,
                  }).render()
                : [];
        const content = document.querySelector('.main-layout__content');

        content.innerHTML = SearchViewTemplate({
            tracks: this.data.tracks,
            artists: this.data.artists,
            albums: this.data.albums,
        });
        player.setup(document.querySelectorAll('.track-list-item'));

        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }
}

export default new SearchView();
