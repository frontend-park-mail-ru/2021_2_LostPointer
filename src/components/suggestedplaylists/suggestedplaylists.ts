import { Component } from '../component/component';
import { SuggestedPlaylist } from '../suggestedplaylist/suggestedplaylist';

import SuggestedPlaylistsTemplate from './suggestedplaylists.hbs';

interface ISuggestedPlaylistsProps {
    playlists: Array<any>
}

class SuggestedPlaylists extends Component<ISuggestedPlaylistsProps> {
    constructor(props) {
        super(props);
        this.props.playlists = props.playlists.map((pl) => ({ playlist: new SuggestedPlaylist(pl).render() }));
    }

    render() {
        return SuggestedPlaylistsTemplate({playlists: this.props.playlists});
    }
}

export { SuggestedPlaylists };