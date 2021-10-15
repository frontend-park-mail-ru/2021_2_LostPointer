import { Component } from '../../framework/core/component.js';

class Track extends Component {
  constructor(props) {
    super(props);
    this.data = {
      cover: props.cover,
      title: props.title,
      artist: props.artist,
      file: props.file,
      pos: props.pos,
      album: props.album,
    };
    this.template = Handlebars.templates['track.hbs'](this.data);
  }

  render() {
    document.querySelector('.suggested-tracks-container').insertAdjacentHTML('beforeend', this.getHtml());
  }
}

export { Track };
