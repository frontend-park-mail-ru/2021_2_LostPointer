import { Component } from '../../managers/component';
import { SuggestedPlaylist } from '../suggestedplaylist/suggestedplaylist';

const SuggestedPlaylistsTemplate = require('./suggestedplaylists.hbs');

class SuggestedPlaylists extends Component {
    constructor(props) {
        super(props);
        this.data.playlists = props.playlists.map((pl) => ({ playlist: new SuggestedPlaylist(pl) }));
        this.template = SuggestedPlaylistsTemplate;
    }
}

export { SuggestedPlaylists };
