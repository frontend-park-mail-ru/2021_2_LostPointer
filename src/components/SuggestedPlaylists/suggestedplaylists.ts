import { Component } from '../Component/component';
import { SuggestedPlaylist } from '../Playlist/suggestedplaylist';

import SuggestedPlaylistsTemplate from './suggestedplaylists.hbs';
import './suggestedplaylists.scss';
import { PlaylistModel } from 'models/playlist';

interface ISuggestedPlaylistsProps {
    playlists: Array<PlaylistModel>;
}

export class SuggestedPlaylists extends Component<ISuggestedPlaylistsProps> {
    constructor(props) {
        super(props);
        this.props.playlists = props.playlists.map((pl) => (
            new SuggestedPlaylist(pl).render()
        ));
        this.props.playlists.push(new SuggestedPlaylist({
            props: {
                    artwork: '',
                    title: 'Create new...',
                    id: 0,
                    is_public: false,
                }
            }).render()
        );
    }

    render() {
        return SuggestedPlaylistsTemplate({ playlists: this.props.playlists });
    }
}
