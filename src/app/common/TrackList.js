import { Component } from '../../framework/core/component.js';
import { Track } from './Track.js';

class TrackList extends Component {
  constructor(props) {
    super(props);
    let pos = 0;
    this.data.tracks = props.tracks.map((e) => {
      e.pos = pos++;
      return { track: new Track(e) };
    });
    this.template = Handlebars.templates['tracklist.hbs'](this.data);
  }
}

export { TrackList };
