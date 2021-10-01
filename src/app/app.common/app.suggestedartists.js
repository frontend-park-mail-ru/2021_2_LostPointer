import { Component } from '../../framework/core/component.js';

class AppSuggestedArtists extends Component {
  constructor(props) {
    super(props);
    // eslint-no-undef
    this.template = Handlebars.templates['suggestedartists.hbs'](this.data);
  }
}

export { AppSuggestedArtists };
