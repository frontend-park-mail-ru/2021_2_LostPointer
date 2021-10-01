import { Component } from '../../framework/core/component.js';

class AppTopAlbums extends Component {
  constructor(props) {
    super(props);
    this.template = Handlebars.templates['topalbums.hbs'](this.data);
  }

  render() {
    this.template = Handlebars.templates['topalbums.hbs'](this.data);
  }
}

export { AppTopAlbums };
