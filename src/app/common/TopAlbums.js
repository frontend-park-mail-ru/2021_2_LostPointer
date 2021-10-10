import { Component } from '../../framework/core/component.js';

class TopAlbums extends Component {
  constructor(props) {
    super(props);
    this.template = Handlebars.templates['topalbums.hbs'](this.data);
  }

  render() {
    this.template = Handlebars.templates['topalbums.hbs'](this.data);
  }
}

export { TopAlbums };
