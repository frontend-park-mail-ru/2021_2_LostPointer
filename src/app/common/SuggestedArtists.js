import { Component } from '../../framework/core/component.js';

class SuggestedArtists extends Component {
  constructor(props) {
    super(props);
    this.template = Handlebars.templates['suggestedartists.hbs'](this.data);
  }
}

export { SuggestedArtists };
