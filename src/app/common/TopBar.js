import { Component } from '../../framework/core/component.js';

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.data = {
      avatar_img: 'ava.png',
      auth_img: 'logout.png',
    };
    this.template = Handlebars.templates['topbar.hbs'](this.data);
  }
}

export { TopBar };
