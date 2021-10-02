import { Component } from '../../framework/core/component.js';

export class InputFormComponent extends Component {
  constructor(props) {
    super(props);
    this.template = `
      <input class="auth-form__input" type="{{ type }}" name="{{ name }}" placeholder="{{ placeholder }}">
    `;
  }
}
