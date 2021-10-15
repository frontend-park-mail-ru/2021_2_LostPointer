import { Component } from '../../framework/core/component.js';

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.data.avatar = props.avatar ? props.avatar : 'ava.png';
    this.template = Handlebars.templates['topbar.hbs'](this.data);
  }

  update() {
    this.template = Handlebars.templates['topbar.hbs'](this.data);
    document.querySelector('.topbar').outerHTML = this.getHtml();
  }
}

export { TopBar };
