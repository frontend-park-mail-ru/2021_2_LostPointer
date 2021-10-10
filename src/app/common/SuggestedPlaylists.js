import { Component } from '../../framework/core/component.js';
import { SuggestedPlaylist } from './SuggestedPlaylist.js';

class SuggestedPlaylists extends Component {
  constructor(props) {
    super(props);
    this.data.playlists = props.playlists.map((pl) => ({ playlist: new SuggestedPlaylist(pl) }));
    this.template = Handlebars.templates['suggestedplaylists.hbs'](this.data);
  }
}

export { SuggestedPlaylists };
