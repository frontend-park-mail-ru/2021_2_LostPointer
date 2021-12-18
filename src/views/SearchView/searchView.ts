import Request from 'services/request/request';
import player from 'components/Player/player';
import { View } from 'views/View/view';
import { disableBrokenImg } from 'views/utils';
import store from 'services/store/store';
import { TrackModel } from 'models/track';
import { AlbumModel } from 'models/album';
import { ArtistModel } from 'models/artist';
import { TrackList } from 'components/TrackList/tracklist';
import { SuggestedArtists } from 'components/SuggestedArtists/suggestedartists';
import { TopAlbums } from 'components/TopAlbums/topalbums';
import TopbarComponent from 'components/Topbar/topbar';
import sidebar from 'components/Sidebar/sidebar';
import { PlaylistModel } from 'models/playlist';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import IndexTemplate from 'views/IndexView/indexView.hbs';
import mobile from 'components/Mobile/mobile';

import SearchViewTemplate from './searchView.hbs';
import './searchView.scss';
import { TrackComponent } from 'components/TrackComponent/track';

const SEARCH_TIMEOUT = 200;

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
    private searchTimer: any; //TODO=Поправить
    private data: ISearchViewData;
    private tracks: TrackModel[];
    private artists: ArtistModel[];
    private albums: AlbumModel[];
    private noResults: boolean;
    private userPlaylists: Array<PlaylistModel>;

    constructor(props?: ISearchViewProps) {
        super(props);
        this.isLoaded = false;
        this.data = {
            tracks: null,
            albums: null,
            artists: null,
        };
        this.noResults = false;
    }

    addListeners() {
        document
            .querySelectorAll('.js-playlist-track-add')
            .forEach((button) => {
                button.addEventListener(
                    'click',
                    playlistsContextMenu.addTrackToPlaylist.bind(
                        playlistsContextMenu
                    )
                );
            });
        document
            .querySelector('.js-playlist-create')
            .addEventListener(
                'click',
                playlistsContextMenu.createNewPlaylist.bind(
                    playlistsContextMenu
                )
            );

        document
            .querySelector('.topbar__search-input')
            .addEventListener('input', (e) => {
                const text = (<HTMLInputElement>e.target).value;
                clearTimeout(this.searchTimer);
                this.searchTimer = setTimeout(() => {
                    if (text.length != 0) {
                        Request.get(`/music/search?text=${text}`)
                            .then((response) => {
                                this.tracks = response.tracks
                                    ? TrackModel.serializeList(response.tracks)
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
                        document.querySelector(
                            '.main-layout__content'
                        ).innerHTML = '';
                    }
                }, SEARCH_TIMEOUT);
            });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });

        this.isLoaded = false;
    }

    render() {
        PlaylistModel.getUserPlaylists()
            .then((playlists) => {
                this.userPlaylists = playlists;
            })
            .then(() => {
                playlistsContextMenu.updatePlaylists(this.userPlaylists);
                const app = document.getElementById('app');
                if (app.innerHTML == '') {
                    document.getElementById('app').innerHTML = IndexTemplate({
                        topbar: TopbarComponent.set({
                            authenticated: store.get('authenticated'),
                            avatar: store.get('userAvatar'),
                            offline: !navigator.onLine,
                        }).render(),
                        sidebar: sidebar.render(),
                        player: player.render(),
                        contextMenu: playlistsContextMenu.render(),
                        mobile: mobile.set(player.getNowPlaying()).render(),
                    });
                    player.addHandlers();
                    TopbarComponent.addHandlers();
                }
                document.querySelector('.main-layout__content').innerHTML = '';

                this.addListeners();
            });
    }

    update() {
        if (store.get('authenticated')) {
            TrackComponent.removeToggleFavorListeners();
        }
        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.removeEventListener(
                    'click',
                    playlistsContextMenu.showContextMenu.bind(
                        playlistsContextMenu
                    )
                );
            });

        playlistsContextMenu.deleteRemoveButton();
        document.querySelector('.js-menu-container').innerHTML =
            playlistsContextMenu.render();
        document
            .querySelectorAll('.js-playlist-track-add')
            .forEach((button) => {
                button.addEventListener(
                    'click',
                    playlistsContextMenu.addTrackToPlaylist.bind(
                        playlistsContextMenu
                    )
                );
            });
        document
            .querySelector('.js-playlist-create')
            .addEventListener(
                'click',
                playlistsContextMenu.createNewPlaylist.bind(
                    playlistsContextMenu
                )
            );

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
        player.setup(document.querySelectorAll('.track'));
        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.addEventListener(
                    'click',
                    playlistsContextMenu.showContextMenu.bind(
                        playlistsContextMenu
                    )
                );
            });
        if (store.get('authenticated')) {
            TrackComponent.addToggleFavorListeners();
        }
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    didMount() {
        console.log('not implemented');
    }
}

export default new SearchView();
