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
    this.template = `
    <form class="auth-form" id="auth-form" action="#">
        {{# each inputs}}
            {{# render this}}{{/render}}
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
