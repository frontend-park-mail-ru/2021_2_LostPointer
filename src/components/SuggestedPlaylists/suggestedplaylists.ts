import { Component } from '../Component/component';
import { SuggestedPlaylist } from '../Playlist/suggestedplaylist';
import SuggestedPlaylistsTemplate from './suggestedplaylists.hbs';
import { PlaylistModel } from 'models/playlist';

import PlaylistList from './playlistslist.hbs';
import './suggestedplaylists.scss';

interface ISuggestedPlaylistsProps {
    publicView: boolean;
    playlists: Array<PlaylistModel>;
}

export class SuggestedPlaylists extends Component<ISuggestedPlaylistsProps> {
    constructor() {
        super();
        this.props.publicView = false;
        this.props.playlists = [
            new SuggestedPlaylist({
                props: {
                    artwork: '',
                    title: 'Create new...',
                    id: 0,
                    is_public: false,
                },
            }).render(),
        ];
    }

    publicView() {
        return this.props.publicView;
    }

    set(playlists: Array<PlaylistModel>) {
        if (this.props.publicView) {
            this.props.playlists = playlists
                .filter((playlist) => {
                    return (
                        !playlist.getProps().is_own &&
                        playlist.getProps().is_public
                    );
                })
                .map((pl) => new SuggestedPlaylist(pl).render());
        } else {
            this.props.playlists = playlists
                .filter((playlist) => {
                    return playlist.getProps().is_own;
                })
                .map((pl) => new SuggestedPlaylist(pl).render());
            this.props.playlists.push(
                new SuggestedPlaylist({
                    props: {
                        artwork: '',
                        title: 'Create new...',
                        id: 0,
                        is_public: false,
                    },
                }).render()
            );
        }
    }

    toggleView(playlists: Array<PlaylistModel>, toPublic: boolean) {
        this.props.publicView = toPublic;
        const publicPlaylistsBtn = document.querySelector(
            '.js_public_playlists'
        );
        const ownPlaylistsBtn = document.querySelector('.js_own_playlists');
        if (toPublic) {
            publicPlaylistsBtn.classList.remove('inactive');
            ownPlaylistsBtn.classList.add('inactive');
        } else {
            ownPlaylistsBtn.classList.remove('inactive');
            publicPlaylistsBtn.classList.add('inactive');
        }
        this.set(playlists);
        const playlistList = document.querySelector(
            '.suggested-playlists__container'
        );
        playlistList.innerHTML = PlaylistList({
            playlists: this.props.playlists,
        });
    }

    render() {
        return SuggestedPlaylistsTemplate({
            playlists: this.props.playlists,
            publicView: this.props.publicView,
        });
    }
}

export default new SuggestedPlaylists();
