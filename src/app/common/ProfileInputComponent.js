import { Component } from '../../framework/core/component.js';

export class ProfileInputComponent extends Component {
  constructor(props) {
    super(props);
    this.template = Handlebars.templates['profileinput.hbs'](this.data);
  }
}
