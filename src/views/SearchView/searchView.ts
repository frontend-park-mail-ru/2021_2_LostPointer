import Request from 'services/request/request';
import player from 'components/Player/player';
import { View } from 'views/View/view';

import { addTrackToPlaylist, createNewPlaylist, disableBrokenImg, hideContextMenu, showContextMenu } from 'views/utils';

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
import { ContextMenu } from 'components/ContextMenu/contextMenu';

import SearchViewTemplate from './searchView.hbs';
import './searchView.scss';
import IndexTemplate from 'views/IndexView/indexView.hbs';

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
    private contextMenu: ContextMenu;
    private menuVisible: boolean;
    private renderedMenu: HTMLElement;

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

    didMount() {
        const userPlaylists = PlaylistModel.getUserPlaylists().then(
            (playlists) => {
                this.userPlaylists = playlists;
            }
        );

        Promise.all([userPlaylists]).then(() => {
            const options = [
                {
                    class: 'js-playlist-create',
                    dataId: null,
                    value: 'Add to the new playlist',
                },
            ];
            this.contextMenu = new ContextMenu({
                options: options.concat(
                    this.userPlaylists
                        .filter((playlist) => {
                            return playlist.getProps().is_own;
                        })
                        .map((playlist) => {
                            return {
                                class: `js-playlist-track-add`,
                                dataId: playlist.getProps().id,
                                value: playlist.getProps().title,
                            };
                        })
                ),
            });
        });

        this.isLoaded = true;
    }

    addListeners() {
        window.addEventListener('click', hideContextMenu.bind(this));
        // document
        //     .querySelectorAll('.track-list-item-playlist')
        //     .forEach((element) => {
        //         element.addEventListener('click', showContextMenu.bind(this));
        //     });

        // const createPlaylistBtn = document.querySelector('.js-playlist-create');
        // createPlaylistBtn.addEventListener(
        //     'click',
        //     createNewPlaylist.bind(this)
        // );

        // const addTrackToPlaylistBtns = document.querySelectorAll(
        //     '.js-playlist-track-add'
        // );
        // addTrackToPlaylistBtns.forEach((button) => {
        //     button.addEventListener('click', addTrackToPlaylist.bind(this));
        // });

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
                                    ? response.tracks.reduce(
                                          (acc, elem, index) => {
                                              elem.pos = index;
                                              elem.album = new AlbumModel(
                                                  elem.album
                                              );
                                              elem.artist = new ArtistModel(
                                                  elem.artist
                                              );
                                              acc.push(new TrackModel(elem));
                                              return acc;
                                          },
                                          []
                                      )
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

        // document
        //     .querySelectorAll('.track-list-item-playlist')
        //     .forEach((element) => {
        //         element.removeEventListener(
        //             'click',
        //             showContextMenu.bind(this)
        //         );
        //     });
        // const createPlaylistBtn = document.querySelector('.js-playlist-create');
        // createPlaylistBtn.removeEventListener(
        //     'click',
        //     createNewPlaylist.bind(this)
        // );
        // const addTrackToPlaylistBtns = document.querySelectorAll(
        //     '.js-playlist-track-add'
        // );
        // addTrackToPlaylistBtns.forEach((button) => {
        //     button.removeEventListener('click', addTrackToPlaylist.bind(this));
        // });

        window.removeEventListener('click', hideContextMenu.bind(this));

        this.isLoaded = false;
    }

    render() {
        this.didMount()

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
                contextMenu: this.contextMenu.render(),
            });
            TopbarComponent.addHandlers();
        }
        document.querySelector('.main-layout__content').innerHTML = '';
        this.renderedMenu = document.querySelector('.menu');
        this.menuVisible = false;
        this.addListeners();
    }

    update() {
        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.removeEventListener(
                    'click',
                    showContextMenu.bind(this)
                );
            });

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
        player.setup(document.querySelectorAll('.track-list-item'));
        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.addEventListener('click', showContextMenu.bind(this));
            });
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }
}

export default new SearchView();
