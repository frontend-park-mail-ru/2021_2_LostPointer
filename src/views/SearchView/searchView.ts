import Request from 'services/request/request';
import { View } from 'views/View/view';
import {
    addDisableBrokenImgListeners,
    removeDisableBrokenImgListeners,
} from 'views/utils';
import { TrackModel } from 'models/track';
import { AlbumModel } from 'models/album';
import { ArtistModel } from 'models/artist';
import { TopAlbums, TrackList } from 'lostpointer-uikit';
import { SuggestedArtists } from 'components/SuggestedArtists/suggestedartists';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import baseView from 'views/BaseView/baseView';
import { TrackComponent } from 'components/TrackComponent/track';
import store from 'services/store/store';

import SearchViewTemplate from './searchView.hbs';
import './searchView.scss';

const SEARCH_TIMEOUT = 200;

interface ISearchViewData {
    tracks: string;
    albums: string;
    artists: string;
}

export class SearchView extends View<never> {
    private searchTimer: any; //TODO=Поправить
    private data: ISearchViewData;
    private tracks: TrackModel[];
    private artists: ArtistModel[];
    private albums: AlbumModel[];
    private noResults: boolean;
    private userPlaylists: Array<PlaylistModel>;

    constructor(props?: never) {
        super(props);
        this.data = {
            tracks: null,
            albums: null,
            artists: null,
        };
        this.noResults = false;
    }

    handleInput(e) {
        const text = (<HTMLInputElement>e.target).value;
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
            if (text.length != 0) {
                Request.get(`/music/search?text=${text}`)
                    .then((response) => {
                        this.tracks = response.tracks
                            ? response.tracks.reduce((acc, elem, index) => {
                                  elem.pos = index;
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
            } else {
                document.querySelector('.main-layout__content').innerHTML = '';
            }
        }, SEARCH_TIMEOUT);
    }

    addListeners() {
        document
            .querySelector('.topbar__search-input')
            .addEventListener('input', this.handleInput.bind(this));
    }

    unmount() {
        removeDisableBrokenImgListeners();
        playlistsContextMenu.removeListeners();
        const input = document.querySelector('.topbar__search-input');
        if (input) {
            input.removeEventListener('input', this.handleInput.bind(this));
        }
    }

    render() {
        PlaylistModel.getUserPlaylists()
            .then((playlists) => {
                this.userPlaylists = playlists;
            })
            .then(() => {
                playlistsContextMenu.updatePlaylists(this.userPlaylists);
                baseView.render();
                document.querySelector('.main-layout__content').innerHTML = '';
                this.addListeners();
            });
    }

    update() {
        if (store.get('authenticated')) {
            TrackComponent.removeToggleFavorListeners();
        }
        playlistsContextMenu.removeListeners();
        playlistsContextMenu.deleteRemoveButton();
        document.querySelector('.js-menu-container').innerHTML =
            playlistsContextMenu.render();

        this.data.tracks =
            this.tracks.length !== 0
                ? new TrackList<TrackModel>({
                      title: 'Tracks',
                      tracks: this.tracks.map((track) => track.getProps()),
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
                ? new TopAlbums({
                      albums: this.albums,
                      compact: true,
                  }).render()
                : [];

        this.noResults =
            this.data.albums.length +
                this.data.artists.length +
                this.data.tracks.length ===
            0;

        const content = document.querySelector('.main-layout__content');
        content.innerHTML = SearchViewTemplate({
            tracks: this.data.tracks,
            artists: this.data.artists,
            albums: this.data.albums,
            not_found: this.noResults,
        });
        playlistsContextMenu.addListeners();
        if (store.get('authenticated')) {
            TrackComponent.addToggleFavorListeners();
        }
        addDisableBrokenImgListeners();
    }

    getTracksContext(): TrackModel[] {
        return this.tracks;
    }
}

export default new SearchView();
