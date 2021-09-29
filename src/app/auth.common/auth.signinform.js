import { Component } from '../../framework/core/component.js';
import { emailInput, simplePasswordInput } from './auth.input.js';

class SigninAuthForm extends Component {
  constructor(config) {
    super(config);
    this.selector = 'auth-form';
    this.template = `
    {{# each inputs}}
        <label for="{{ data.id }}">
          <input class="auth-form__input" type="{{ data.type }}" id="{{ data.id }}" name="{{ data.name }}" placeholder="{{ data.placeholder }}">
          <ul class="auth-form__input-requirements">
              {{# each data.input_requirements}}
                  <li>{{ msg }}</li>
              {{/each}}
          </ul>
      </label>
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
