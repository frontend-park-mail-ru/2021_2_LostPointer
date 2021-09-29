import { Component } from '../../framework/core/component.js';

class InputFormComponent extends Component {
  constructor(props) {
    super(props);
    this.template = `
      <label for="{{ id }}">
          <input class="auth-form__input" type="{{ type }}" id="{{ id }}" placeholder="{{ placeholder }}">
      </label>
    `;
  }
}

export const nameInput = new InputFormComponent({
  data: {
    id: 'name',
    type: 'text',
    placeholder: 'Name',
  },
});

export const emailInput = new InputFormComponent({
  data: {
    id: 'email',
    type: 'text',
    placeholder: 'Email',
  },
});

export const simplePasswordInput = new InputFormComponent({
  data: {
    id: 'password',
    type: 'password',
    placeholder: 'Password',
  },
});

export const passwordInput = new InputFormComponent({
  data: {
    id: 'password',
    type: 'password',
    placeholder: 'Password',
  },
});

export const confirmPasswordInput = new InputFormComponent({
  data: {
    id: 'confirm_password',
    type: 'password',
    placeholder: 'Confirm password',
  },
});
