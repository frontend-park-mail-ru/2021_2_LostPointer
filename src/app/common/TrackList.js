import { Component } from '../../framework/core/component.js';
import { Track } from './Track.js';

class TrackList extends Component {
  constructor(props) {
    super(props);
    this.data.tracks = props.tracks.map((e) => ({ track: new Track(e) }));
    this.template = Handlebars.templates['tracklist.hbs'](this.data);
  }
}

export { TrackList };
