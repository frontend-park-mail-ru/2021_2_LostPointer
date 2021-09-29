import { Component } from '../../framework/core/component.js';
import { emailInput, simplePasswordInput } from './auth.input.js';

class SigninAuthForm extends Component {
  constructor(config) {
    super(config);
    this.selector = 'auth-form';
    this.template = `
    {{# each inputs}}
        // TODO здесь рендерить input'ы
    {{/each}}
    <div class="auth-form__fail_msg">
        {{ fail_msg }}
    </div>
    <button class="auth-form__submit" type="submit">{{ button_msg }}</button>
    `;
    this.data = {
      fail_msg: 'Authentication failed',
      button_msg: 'Sign in',
      inputs: [
        emailInput,
        simplePasswordInput,
      ],
    };
  }
}

export const signinForm = new SigninAuthForm();
