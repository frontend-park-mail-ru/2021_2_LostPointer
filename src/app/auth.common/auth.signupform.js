import { Component } from '../../framework/core/component.js';
import {
  confirmPasswordInput,
  emailInput,
  nameInput,
  passwordInput,
} from './auth.input.js';

class SignupAuthForm extends Component {
  constructor(config) {
    super(config);
    this.selector = 'auth-form';
    this.template = `
    <form class="auth-form" id="auth-form" action="#">
        {{# each inputs}}
            <label for="{{ data.id }}">
                <input class="auth-form__input" type="{{ data.type }}" id="{{ data.id }}" placeholder="{{ data.placeholder }}">
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
     </form>
    `;
    this.data = {
      fail_msg: 'Registration failed',
      button_msg: 'Sign up',
      inputs: [
        nameInput,
        emailInput,
        passwordInput,
        confirmPasswordInput,
      ],
    };
  }
}

export const signupForm = new SignupAuthForm();