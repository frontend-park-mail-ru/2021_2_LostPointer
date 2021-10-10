import { Component } from '../../framework/core/component.js';

class SuggestedPlaylist extends Component {
  constructor(props) {
    super(props);
    this.data = {
      cover: props.cover,
      title: props.title,
    };
    this.template = Handlebars.templates['suggestedplaylist.hbs'](this.data);
  }
}

export { SuggestedPlaylist };
