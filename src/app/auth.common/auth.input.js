import { Component } from '../../framework/core/component.js';

export class InputFormComponent extends Component {
  constructor(props) {
    super(props);
    this.template = Handlebars.templates['auth.input.hbs'](this.data);
  }
}
