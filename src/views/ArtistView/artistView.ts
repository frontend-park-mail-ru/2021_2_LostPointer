import { View } from 'views/View/view';

import { Sidebar } from 'components/Sidebar/sidebar';
import TopbarComponent, { Topbar } from 'components/Topbar/topbar';
import { SuggestedAlbums } from 'components/SugestedAlbums/suggestedAlbums';
import { TrackList } from 'components/TrackList/tracklist';
import { ArtistModel } from 'models/artist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import disableBrokenImg from 'views/utils';

import { playButtonHandler } from 'components/common';

import ArtistTemplate from './artistView.hbs';
import './artistView.scss';

interface IArtistViewProps {
    authenticated: boolean;
}

export class ArtistView extends View<IArtistViewProps> {
    private sidebar: Sidebar;
    private topbar: Topbar;
    private artist: ArtistModel;
    private trackList: TrackList;
    private albumList: SuggestedAlbums;
    private firstTimePlayed: boolean;
    private previousState: string;

    constructor(props?: IArtistViewProps) {
        super(props);
        this.firstTimePlayed = true;
        this.isLoaded = false;
    }

    reset() {
        this.firstTimePlayed = true;
    }

    didMount() {
        const regex = /^\/artist\/(\d+)$/gm;
        const match = regex.exec(window.location.pathname);
        if (!match) {
            router.go(routerStore.dashboard);
        }
        const artistId = match[1];

        const artist = ArtistModel.getArtist(artistId).then((artist) => {
            if (!artist) {
                router.go(routerStore.dashboard);
            }
            this.artist = artist;
        });

        Promise.all([artist]).then(() => {
            this.topbar = TopbarComponent;
            this.sidebar = new Sidebar().render();
            this.albumList = new SuggestedAlbums({
                albums: this.artist.getProps().albums,
            }).render();
            const props = this.artist.getProps();
            const tracks = props.tracks.map((track) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                track.props.artist = this.artist;
                //TODO=ПОПРАВИТЬ!!!
                return track;
            });
            this.trackList = new TrackList({
                title: 'Tracks',
                tracks: tracks,
            }).render();
            this.isLoaded = true;
            this.render();
        });
    }

    addListeners() {
        const video = document.querySelector('.artist__background-video');
        if (video) {
            video.addEventListener('ended', () => {
                video.classList.add('transition');
            });
        }

        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
        // this.isLoaded = false;
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('content').innerHTML = ArtistTemplate({
            name: this.artist.getProps().name,
            video: this.artist.getProps().video,
            artistAvatar: this.artist.getProps().avatar,

            albumList: this.albumList,
            trackList: this.trackList,
        });

        this.addListeners();

        document
            .querySelectorAll('.track-list-item-play')
            .forEach((e) =>
                e.addEventListener('click', playButtonHandler.bind(this))
            );
    }
}

export default new ArtistView();
