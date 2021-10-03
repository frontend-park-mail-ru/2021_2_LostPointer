import { Component } from '../../framework/core/component.js';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    // eslint-no-undef
    this.template = Handlebars.templates['sidebar.hbs']();
  }
}

export { Sidebar };
